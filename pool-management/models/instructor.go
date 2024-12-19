package models

import (
	"database/sql"
	"errors"
)

type Instructor struct {
	ID         int     `json:"id"`
	FirstName  string  `json:"first_name"`
	LastName   string  `json:"last_name"`
	MiddleName string  `json:"middle_name"`
	Salary     float64 `json:"salary"`
	PoolID     *int    `json:"pool_id"`
	Email      string  `json:"email"`
}

func GetAllInstructors(db *sql.DB) ([]Instructor, error) {
	query := `
	SELECT instructor_id, first_name, last_name, middle_name, salary, pool_id, email 
	FROM "public"."Instructors"
	ORDER BY instructor_id ASC`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var instructors []Instructor
	for rows.Next() {
		var instructor Instructor
		if err := rows.Scan(&instructor.ID, &instructor.FirstName, &instructor.LastName, &instructor.MiddleName, &instructor.Salary, &instructor.PoolID, &instructor.Email); err != nil {
			return nil, err
		}
		instructors = append(instructors, instructor)
	}
	return instructors, nil
}

func AddInstructor(db *sql.DB, instructor *Instructor) error {
	if instructor.Salary <= 0 {
		return errors.New("salary must be positive")
	}
	query := `
		INSERT INTO "public"."Instructors" (first_name, last_name, middle_name, salary, pool_id, email)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING instructor_id
	`
	return db.QueryRow(query, instructor.FirstName, instructor.LastName, instructor.MiddleName, instructor.Salary, instructor.PoolID, instructor.Email).Scan(&instructor.ID)
}

func UpdateInstructor(db *sql.DB, instructor *Instructor) error {
	if instructor.Salary <= 0 {
		return errors.New("salary must be positive")
	}
	query := `
		UPDATE "public"."Instructors"
		SET first_name = $1, last_name = $2, middle_name = $3, salary = $4, pool_id = $5, email = $6
		WHERE instructor_id = $7
	`
	_, err := db.Exec(query, instructor.FirstName, instructor.LastName, instructor.MiddleName, instructor.Salary, instructor.PoolID, instructor.Email, instructor.ID)
	return err
}

func DeleteInstructor(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."Instructors" WHERE instructor_id = $1`
	_, err := db.Exec(query, id)
	return err
}
