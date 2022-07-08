package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/contrib/static"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var db = make(map[string]string)

type WeatherResponse struct {
	Coord struct {
		Lat float32 `json:"lat"`
		Lon float32 `json:"lon"`
	} `json:"coord"`
	Weather []struct {
		Id int `json:"id"`
		Main string `json:"main"`
		Description string `json:"description"`
		Icon string `json:"icon"`
	} `json:"weather"`
	Base string `json:"base"`
	Main struct {
		Temp float32 `json:"temp"`
		FeelsLike float32 `json:"feels_like"`
		TempMin float32 `json:"temp_min"`
		TempMax float32 `json:"temp_max"`
		Pressure float32 `json:"pressure"`
		Humidity float32 `json:"humidity"`
	} `json:"main"`
	Visibility float32 `json:"visibility"`
	Wind struct {
		Speed float32 `json:"speed"`
		Deg float32 `json:"deg"`
	} `json:"wind"`
	Clouds struct {
		All float32 `json:"all"`
	} `json:"wind"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	r := gin.Default()
	r.SetTrustedProxies([]string{"localhost"})
	r.Use(static.Serve("/", static.LocalFile("./clientBuild", true)))
	openWeatherKey := os.Getenv("openWeatherKey")

	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.String(http.StatusOK, "pong")
		})
		api.GET("/weather", func(context *gin.Context) {
			latitude := context.Query("latitude")
			longitude := context.Query("longitude")

			resp, err := http.Get(fmt.Sprintf(
				"https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s",
				latitude,
				longitude,
				openWeatherKey))

			if err != nil {
				log.Fatalln(err)
				context.String(http.StatusInternalServerError, "Something went wrong :P")
			}

			defer resp.Body.Close()

			body, err := ioutil.ReadAll(resp.Body)

			var result WeatherResponse
			if err := json.Unmarshal(body, &result); err != nil {
				fmt.Println("Can not unmarshal JSON")
				context.String(http.StatusInternalServerError, "Something went wrong :P")
			}
			context.JSON(http.StatusOK, result)
		})
	}
	r.Run(":8080")
}
