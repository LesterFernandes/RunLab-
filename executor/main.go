package main

import (
	"fmt"
	"time"
)

func main() {
	cr, err := NewCodeRunner()
	if err != nil {
		fmt.Println(err)
		return
	}

	result, err := cr.Run("console.log('Beee Beee')", "js", 5*time.Second)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(result)
}
