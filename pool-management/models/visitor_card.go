package models

import (
	"database/sql"
)

type VisitorCard struct {
	ID                  int    `json:"id"`
	SubscriptionID      int    `json:"subscription_id"`
	ClientID            int    `json:"client_id"`
	StartDate           string `json:"start_date"`
	ExpiryDate          string `json:"expiry_date"`
	AttendanceLeftCount int    `json:"attendance_left_count"`
}

func GetAllVisitorCards(db *sql.DB) ([]VisitorCard, error) {
	query := `
	SELECT vc.card_id, vc.subscription_id, vc.client_id, vc.start_date, vc.expiry_date, vc.attendance_left_count
	FROM "public"."VisitorCards" vc
	ORDER BY vc.card_id ASC
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var visitorCards []VisitorCard
	for rows.Next() {
		var vc VisitorCard
		if err := rows.Scan(&vc.ID, &vc.SubscriptionID, &vc.ClientID, &vc.StartDate, &vc.ExpiryDate, &vc.AttendanceLeftCount); err != nil {
			return nil, err
		}
		visitorCards = append(visitorCards, vc)
	}
	return visitorCards, nil
}

func AddVisitorCard(db *sql.DB, vc *VisitorCard) error {
	query := `
		INSERT INTO "public"."VisitorCards" (subscription_id, client_id, start_date, expiry_date, attendance_left_count)
		VALUES ($1, $2, $3, $4, $5) RETURNING card_id
	`
	return db.QueryRow(query, vc.SubscriptionID, vc.ClientID, vc.StartDate, vc.ExpiryDate, vc.AttendanceLeftCount).Scan(&vc.ID)
}

func UpdateVisitorCard(db *sql.DB, vc *VisitorCard) error {
	query := `
		UPDATE "public"."VisitorCards"
		SET subscription_id = $1, client_id = $2, start_date = $3, expiry_date = $4, attendance_left_count = $5
		WHERE card_id = $6
	`
	_, err := db.Exec(query, vc.SubscriptionID, vc.ClientID, vc.StartDate, vc.ExpiryDate, vc.AttendanceLeftCount, vc.ID)
	return err
}

func DeleteVisitorCard(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."VisitorCards" WHERE card_id = $1`
	_, err := db.Exec(query, id)
	return err
}
