package models

import (
	"database/sql"
	"errors"
)

type Pool struct {
	ID       int `json:"id"`
	Capacity int `json:"capacity"`
}

func GetAllPools(db *sql.DB) ([]Pool, error) {
	query := `
	SELECT pool_id, capacity 
	FROM "public"."Pools"
	ORDER BY pool_id ASC`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var pools []Pool
	for rows.Next() {
		var pool Pool
		if err := rows.Scan(&pool.ID, &pool.Capacity); err != nil {
			return nil, err
		}
		pools = append(pools, pool)
	}
	return pools, nil
}

func AddPool(db *sql.DB, pool *Pool) error {
	if pool.ID == 0 {
		return errors.New("pool_id must be a non-zero positive integer")
	}
	if pool.Capacity <= 0 {
		return errors.New("capacity must be a positive integer")
	}

	query := `INSERT INTO "public"."Pools" (pool_id, capacity) VALUES ($1, $2)`
	_, err := db.Exec(query, pool.ID, pool.Capacity)
	return err
}

func UpdatePool(db *sql.DB, pool *Pool, old_id int) error {
	if pool.Capacity <= 0 {
		return errors.New("capacity must be a positive integer")
	}
	if pool.ID <= 0 || old_id <= 0 {
		return errors.New("pool_id must be a positive integer")
	}

	query := `
		UPDATE "public"."Pools"
		SET pool_id = $1, capacity = $2
		WHERE pool_id = $3
	`
	_, err := db.Exec(query, pool.ID, pool.Capacity, old_id)
	return err
}

func DeletePool(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."Pools" WHERE pool_id = $1`
	_, err := db.Exec(query, id)
	return err
}
