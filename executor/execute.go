package main

import (
	"archive/tar"
	"bytes"
	"context"
	"io"
	"time"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
)

// "github.com/docker/docker/api/types"

type CodeRunner struct {
	client *client.Client
}

func NewCodeRunner() (*CodeRunner, error) {
	cli, err := client.NewClientWithOpts(
		client.FromEnv,
		client.WithAPIVersionNegotiation(),
	)
	if err != nil {
		return nil, err
	}
	return &CodeRunner{
		client: cli,
	}, nil
}

func (cr *CodeRunner) Run(code string, lang string, timeout time.Duration) (any, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	baseImage := "node:current-alpine3.22"
	//pull docker image
	reader, err := cr.client.ImagePull(ctx, baseImage, image.PullOptions{})

	defer func() {
		cancel()
		reader.Close()
	}()

	if err != nil {
		return nil, err
	}
	io.Copy(io.Discard, reader)

	codeRunnerC, err := cr.client.ContainerCreate(ctx, &container.Config{
		Image:      baseImage,
		Cmd:        []string{"sh", "-c", "node /code/solution.js"},
		WorkingDir: "/code",
	}, &container.HostConfig{
		Resources: container.Resources{
			Memory:   128 * 1024 * 1024, // 128MB limit
			CPUQuota: 50000,             // 50% CPU
		},
		NetworkMode: "none", // No network access
	}, nil, nil, "")

	if err != nil {
		return nil, err
	}

	// Create a tar archive
	tarBuffer := new(bytes.Buffer)
	tw := tar.NewWriter(tarBuffer)
	fileName := "solutions.js"
	fileContent := []byte(code)

	hdr := &tar.Header{
		Name: fileName,
		Mode: 0644,
		Size: int64(len(fileContent)),
	}
	if err := tw.WriteHeader(hdr); err != nil {
		return nil, err
	}
	if _, err := tw.Write(fileContent); err != nil {
		return nil, err
	}
	if err := tw.Close(); err != nil {
		return nil, err
	}

	// Copy the tar archive into /code in the container
	err = cr.client.CopyToContainer(
		ctx,
		codeRunnerC.ID,
		"/code",
		bytes.NewReader(tarBuffer.Bytes()),
		container.CopyToContainerOptions{
			AllowOverwriteDirWithFile: true,
		})
	if err != nil {
		return nil, err
	}

	// Start container
	if err := cr.client.ContainerStart(ctx, codeRunnerC.ID, container.StartOptions{}); err != nil {
		return nil, err
	}

	// Wait for completion
	statusCh, errCh := cr.client.ContainerWait(ctx, codeRunnerC.ID, container.WaitConditionNotRunning)
	select {
	case err := <-errCh:
		return nil, err
	case <-statusCh:
	}

	out, err := cr.client.ContainerLogs(ctx, codeRunnerC.ID, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
	})

	if err != nil {
		return nil, err
	}

	output, _ := io.ReadAll(out)

	cr.client.ContainerRemove(ctx, codeRunnerC.ID, container.RemoveOptions{Force: true})

	return string(output), nil
}
