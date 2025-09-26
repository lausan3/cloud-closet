package main

import (
	"cloudcloset/config"
	"cloudcloset/infra/logger"
	"cloudcloset/routers"
)

func main() {
	c := config.Configuration{}

	if err := config.SetupConfig(&c); err != nil {
		logger.Fatalf("Configuration could not be setup: %v", err)
	}

	logger.Infof("Configuration loaded: %+v", c)

	router := routers.NewRouter()

	logger.Fatalf("%v", router.Run(c.Server.ServerString()))
}
