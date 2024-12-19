package models

import (
	"database/sql"
	"errors"
)

type SwimLane struct {
	ID     int `json:"id"`
	PoolID int `json:"pool_id"`
}

func GetAllSwimLanes(db *sql.DB) ([]SwimLane, error) {
	query := `
	SELECT swimlane_id, pool_id 
	FROM "public"."SwimLanes"
	ORDER BY swimlane_id ASC`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var swimLanes []SwimLane
	for rows.Next() {
		var lane SwimLane
		if err := rows.Scan(&lane.ID, &lane.PoolID); err != nil {
			return nil, err
		}
		swimLanes = append(swimLanes, lane)
	}
	return swimLanes, nil
}

func AddSwimLane(db *sql.DB, lane *SwimLane) error {
	if lane.ID == 0 {
		return errors.New("swimlane_id must be a non-zero positive integer")
	}

	query := `INSERT INTO "public"."SwimLanes" (swimlane_id, pool_id) VALUES ($1, $2)`
	_, err := db.Exec(query, lane.ID, lane.PoolID)
	return err
}

func UpdateSwimLane(db *sql.DB, lane *SwimLane, old_id int) error {
	if lane.ID <= 0 || old_id <= 0 {
		return errors.New("swimlane_id must be a positive integer")
	}

	query := `
		UPDATE "public"."SwimLanes" 
		SET swimlane_id = $1, pool_id = $2
	 	WHERE swimlane_id = $3
	`
	_, err := db.Exec(query, lane.ID, lane.PoolID, old_id)
	return err
}

func DeleteSwimLane(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."SwimLanes" WHERE swimlane_id = $1`
	_, err := db.Exec(query, id)
	return err
}
