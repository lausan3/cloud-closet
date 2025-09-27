package environment

import (
	logger "main/infra/logger"

	"github.com/spf13/viper"
)

type Configuration struct {
	Server ServerConfiguration
	Gemini GeminiConfiguration
}

func SetupConfig(config *Configuration) error {
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		logger.Errorf("Error to reading config file, %s", err)
		return err
	}

	config.Server = ServerConfiguration{
		Host: viper.GetString("SERVER_HOST"),
		Port: viper.GetString("SERVER_PORT"),
	}

	config.Gemini = GeminiConfiguration{
		Key: viper.GetString("GEMINI_KEY"),
	}

	return nil
}
