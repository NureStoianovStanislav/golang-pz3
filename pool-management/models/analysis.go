package models

import "database/sql"

type PopularSubscription struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type TopSpendingClient struct {
	FullName   string  `json:"full_name"`
	TotalSpent float64 `json:"total_spent"`
}

type TopTrainingClient struct {
	FullName string `json:"full_name"`
	Count    int    `json:"count"`
}

type TopInstructor struct {
	FullName string `json:"full_name"`
	Count    int    `json:"count"`
}

func GetPopularSubscriptions(db *sql.DB) ([]PopularSubscription, error) {
	query := `
	SELECT "Subscriptions".name AS "Назва абонемента", 
	COUNT("VisitorCards".card_id) as "Кількість разів замовлено"
	FROM "Subscriptions"
	INNER JOIN "VisitorCards" ON ("Subscriptions".subscription_id="VisitorCards".subscription_id)
	GROUP BY "Subscriptions".name
	HAVING COUNT("VisitorCards".card_id) >= ALL(
		SELECT COUNT(card_id) 
		FROM "VisitorCards"
		INNER JOIN "Subscriptions" ON ("Subscriptions".subscription_id="VisitorCards".subscription_id)
		GROUP BY "Subscriptions".subscription_id)
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []PopularSubscription
	for rows.Next() {
		var result PopularSubscription
		if err := rows.Scan(&result.Name, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	return results, nil
}

func GetTopSpendingClients(db *sql.DB) ([]TopSpendingClient, error) {
	query := `
	SELECT ("Clients".last_name || ' ' || "Clients".first_name || ' ' || "Clients".middle_name) AS "ПІБ клієнта", 
	SUM("Subscriptions".price) AS "Грошей витрачено"
	FROM "Clients"
	INNER JOIN "VisitorCards" ON ("Clients".client_id="VisitorCards".client_id)
	INNER JOIN "Subscriptions" ON ("VisitorCards".subscription_id="Subscriptions".subscription_id)
	GROUP BY "Clients".first_name, "Clients".last_name, "Clients".middle_name
	HAVING SUM("Subscriptions".price) >= ALL(
		SELECT SUM("Subscriptions".price) 
		FROM "Subscriptions"
		INNER JOIN "VisitorCards" ON ("Subscriptions".subscription_id="VisitorCards".subscription_id)
		GROUP BY "VisitorCards".card_id)
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []TopSpendingClient
	for rows.Next() {
		var result TopSpendingClient
		if err := rows.Scan(&result.FullName, &result.TotalSpent); err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	return results, nil
}

func GetTopTrainingClients(db *sql.DB) ([]TopTrainingClient, error) {
	query := `
	SELECT ("Clients".last_name || ' ' || "Clients".first_name || ' ' || "Clients".middle_name) AS "ПІБ клієнта", 
	COUNT("Trainings".training_id) AS "Кількість тренувань відвідано"
	FROM "Clients"
	INNER JOIN "VisitorCards" ON ("Clients".client_id="VisitorCards".client_id)
	INNER JOIN "Trainings" ON ("VisitorCards".card_id="Trainings".card_id)
	GROUP BY "Clients".first_name, "Clients".last_name, "Clients".middle_name
	HAVING COUNT("Trainings".training_id) >= ALL(
		SELECT COUNT("Trainings".training_id) 
		FROM "Trainings"
		INNER JOIN "VisitorCards" ON ("Trainings".card_id="VisitorCards".card_id)
		GROUP BY "VisitorCards".card_id)
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []TopTrainingClient
	for rows.Next() {
		var result TopTrainingClient
		if err := rows.Scan(&result.FullName, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	return results, nil
}

func GetTopInstructors(db *sql.DB) ([]TopInstructor, error) {
	query := `
	SELECT ("Instructors".last_name || ' ' || "Instructors".first_name || ' ' || "Instructors".middle_name) AS "ПІБ інструктора", 
	COUNT(DISTINCT "Trainings".card_id) AS client_count
	FROM "Instructors"
	INNER JOIN "Pools" ON "Instructors".pool_id = "Pools".pool_id
	INNER JOIN "SwimLanes" ON "Pools".pool_id = "SwimLanes".pool_id
	INNER JOIN "Trainings" ON "SwimLanes".swimlane_id = "Trainings".swimlane_id
	GROUP BY "Instructors".first_name, "Instructors".last_name, "Instructors".middle_name
	HAVING COUNT(DISTINCT "Trainings".card_id) >= ALL (
	  SELECT COUNT(DISTINCT "Trainings".card_id)
	  FROM "Instructors"
	  INNER JOIN "Pools" ON "Instructors".pool_id = "Pools".pool_id
	  INNER JOIN "SwimLanes" ON "Pools".pool_id = "SwimLanes".pool_id
	  INNER JOIN "Trainings" ON "SwimLanes".swimlane_id = "Trainings".swimlane_id
	  GROUP BY "Instructors".pool_id
	)
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []TopInstructor
	for rows.Next() {
		var result TopInstructor
		if err := rows.Scan(&result.FullName, &result.Count); err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	return results, nil
}
