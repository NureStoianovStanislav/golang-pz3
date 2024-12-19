package main

import (
	"log"
	"pool-management/config"
	"pool-management/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		panic("No .env file found")
	}

	config.InitDB()

	r := gin.Default()
	r.Use(cors.Default())
	routes.SetupRoutes(r)

	log.Println("Server is running on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
