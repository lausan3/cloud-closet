package environment

import (
	"fmt"
)

type ServerConfiguration struct {
	Host string
	Port string
}

func (sc ServerConfiguration) ServerString() string {
	serverString := fmt.Sprintf("%s:%s", sc.Host, sc.Port)

	return serverString
}
