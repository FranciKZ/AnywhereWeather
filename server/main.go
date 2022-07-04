package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/contrib/static"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	// Get user value
	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	// Authorized group (uses gin.BasicAuth() middleware)
	// Same than:
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Credentials{
	//	  "foo":  "bar",
	//	  "manu": "123",
	//}))
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo":  "bar", // user:foo password:bar
		"manu": "123", // user:manu password:123
	}))

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}

func main() {
	r := gin.Default()
	//r.SetTrustedProxies([]string{"localhost"})
	r.Use(static.Serve("/", static.LocalFile("./clientBuild", true)))
	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.String(http.StatusOK, "pong")
		})
		api.GET("/weather", func(context *gin.Context) {
			latitude := context.Query("latitude")
			longitude := context.Query("longitude")

			resp, err := http.Get(fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=", latitude, longitude))
			if err != nil {
				log.Fatalln(err)
				context.String(http.StatusInternalServerError, "Something went wrong :P")
			}
			defer resp.Body.Close()
			body, err := ioutil.ReadAll(resp.Body) // response body is []byte
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
