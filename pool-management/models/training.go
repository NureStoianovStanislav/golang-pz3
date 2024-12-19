package models

import (
	"database/sql"
	"errors"
)

type Training struct {
	ID            int    `json:"id"`
	Start         string `json:"datetime_start"`
	End           string `json:"datetime_end"`
	SwimLaneID    int    `json:"swimlane_id"`
	VisitorCardID int    `json:"card_id"`
	LockerID      int    `json:"locker_id"`
}

func GetAllTrainings(db *sql.DB) ([]Training, error) {
	query := `
	SELECT training_id, datetime_start, datetime_end, swimlane_id, card_id, locker_id
	FROM "public"."Trainings"
	ORDER BY training_id ASC
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trainings []Training
	for rows.Next() {
		var t Training
		if err := rows.Scan(&t.ID, &t.Start, &t.End, &t.SwimLaneID, &t.VisitorCardID, &t.LockerID); err != nil {
			return nil, err
		}
		trainings = append(trainings, t)
	}
	return trainings, nil
}

func AddTraining(db *sql.DB, t *Training) error {
	if t.End <= t.Start {
		return errors.New("end time must be after start time")
	}

	query := `
		INSERT INTO "public"."Trainings" (datetime_start, datetime_end, swimlane_id, card_id, locker_id)
		VALUES ($1, $2, $3, $4, $5) RETURNING training_id
	`
	return db.QueryRow(query, t.Start, t.End, t.SwimLaneID, t.VisitorCardID, t.LockerID).Scan(&t.ID)
}

func UpdateTraining(db *sql.DB, t *Training) error {
	if t.End <= t.Start {
		return errors.New("end time must be after start time")
	}

	query := `
		UPDATE "public"."Trainings"
		SET datetime_start = $1, datetime_end = $2, swimlane_id = $3, card_id = $4, locker_id = $5
		WHERE training_id = $6
	`
	_, err := db.Exec(query, t.Start, t.End, t.SwimLaneID, t.VisitorCardID, t.LockerID, t.ID)
	return err
}

func DeleteTraining(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."Trainings" WHERE training_id = $1`
	_, err := db.Exec(query, id)
	return err
}
