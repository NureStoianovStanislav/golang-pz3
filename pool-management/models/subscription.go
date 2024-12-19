package models

import (
	"database/sql"
	"log"
)

type Subscription struct {
	ID              int     `json:"id"`
	Name            string  `json:"name"`
	Price           float64 `json:"price"`
	AttendanceCount int     `json:"attendance_count"`
	DayCount        int     `json:"day_count"`
}

func GetAllSubscriptions(db *sql.DB) ([]Subscription, error) {
	query := `
	SELECT subscription_id, name, price, attendance_count, day_count 
	FROM "public"."Subscriptions"
	ORDER BY subscription_id ASC`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []Subscription
	for rows.Next() {
		var sub Subscription
		if err := rows.Scan(&sub.ID, &sub.Name, &sub.Price, &sub.AttendanceCount, &sub.DayCount); err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		subscriptions = append(subscriptions, sub)
	}

	return subscriptions, nil
}

func AddSubscription(db *sql.DB, sub *Subscription) error {
	query := `INSERT INTO "public"."Subscriptions" (name, price, attendance_count, day_count)
			  VALUES ($1, $2, $3, $4) RETURNING subscription_id`
	return db.QueryRow(query, sub.Name, sub.Price, sub.AttendanceCount, sub.DayCount).Scan(&sub.ID)
}

func UpdateSubscription(db *sql.DB, sub *Subscription) error {
	query := `UPDATE "public"."Subscriptions"
			  SET name = $1, price = $2, attendance_count = $3, day_count = $4
			  WHERE subscription_id = $5`
	_, err := db.Exec(query, sub.Name, sub.Price, sub.AttendanceCount, sub.DayCount, sub.ID)
	return err
}

func DeleteSubscription(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."Subscriptions" WHERE subscription_id = $1`
	_, err := db.Exec(query, id)
	return err
}
