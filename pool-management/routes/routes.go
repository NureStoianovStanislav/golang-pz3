package routes

import (
	"pool-management/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/subscriptions", controllers.GetSubscriptions)
		api.POST("/subscriptions", controllers.AddSubscription)
		api.PUT("/subscriptions/:id", controllers.UpdateSubscription)
		api.DELETE("/subscriptions/:id", controllers.DeleteSubscription)

		api.GET("/clients", controllers.GetClients)
		api.POST("/clients", controllers.AddClient)
		api.PUT("/clients/:id", controllers.UpdateClient)
		api.DELETE("/clients/:id", controllers.DeleteClient)

		api.GET("/visitor_cards", controllers.GetVisitorCards)
		api.POST("/visitor_cards", controllers.AddVisitorCard)
		api.PUT("/visitor_cards/:id", controllers.UpdateVisitorCard)
		api.DELETE("/visitor_cards/:id", controllers.DeleteVisitorCard)

		api.GET("/trainings", controllers.GetTrainings)
		api.POST("/trainings", controllers.AddTraining)
		api.PUT("/trainings/:id", controllers.UpdateTraining)
		api.DELETE("/trainings/:id", controllers.DeleteTraining)

		api.GET("/swimlanes", controllers.GetSwimLanes)
		api.POST("/swimlanes", controllers.AddSwimLane)
		api.PUT("/swimlanes/:id", controllers.UpdateSwimLane)
		api.DELETE("/swimlanes/:id", controllers.DeleteSwimLane)

		api.GET("/pools", controllers.GetPools)
		api.POST("/pools", controllers.AddPool)
		api.PUT("/pools/:id", controllers.UpdatePool)
		api.DELETE("/pools/:id", controllers.DeletePool)

		api.GET("/instructors", controllers.GetInstructors)
		api.POST("/instructors", controllers.AddInstructor)
		api.PUT("/instructors/:id", controllers.UpdateInstructor)
		api.DELETE("/instructors/:id", controllers.DeleteInstructor)

		api.GET("/analysis/popular-subscriptions", controllers.GetPopularSubscriptions)
		api.GET("/analysis/top-spending-clients", controllers.GetTopSpendingClients)
		api.GET("/analysis/top-training-clients", controllers.GetTopTrainingClients)
		api.GET("/analysis/top-instructors", controllers.GetTopInstructors)
	}
}
