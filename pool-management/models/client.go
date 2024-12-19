package models

import (
	"database/sql"
	"fmt"
)

var (
	ValidSexes = map[string]bool{
		"Чоловіча": true,
		"Жіноча":   true,
	}

	ValidPreparationLevels = map[string]bool{
		"Початківець": true,
		"Любитель":    true,
		"Спортсмен":   true,
	}
)

type Client struct {
	ID               int    `json:"id"`
	FirstName        string `json:"first_name"`
	LastName         string `json:"last_name"`
	MiddleName       string `json:"middle_name"`
	Sex              string `json:"sex"`
	PreparationLevel string `json:"preparation_level"`
	DateOfBirth      string `json:"date_of_birth"`
	Email            string `json:"email"`
}

func validateClient(client *Client) error {
	if !ValidSexes[client.Sex] {
		return fmt.Errorf("invalid value for sex: %s", client.Sex)
	}

	if !ValidPreparationLevels[client.PreparationLevel] {
		return fmt.Errorf("invalid value for preparation level: %s", client.PreparationLevel)
	}

	return nil
}

func GetAllClients(db *sql.DB) ([]Client, error) {
	query := `
	SELECT client_id, first_name, last_name, middle_name, sex, preparation_level, date_of_birth, email 
	FROM "public"."Clients"
	ORDER BY client_id ASC`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var client Client
		if err := rows.Scan(&client.ID, &client.FirstName, &client.LastName, &client.MiddleName, &client.Sex, &client.PreparationLevel, &client.DateOfBirth, &client.Email); err != nil {
			return nil, err
		}
		clients = append(clients, client)
	}
	return clients, nil
}

func AddClient(db *sql.DB, client *Client) error {
	if err := validateClient(client); err != nil {
		return err
	}

	query := `INSERT INTO "public"."Clients" (first_name, last_name, middle_name, sex, preparation_level, date_of_birth, email)
			  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING client_id`
	return db.QueryRow(query, client.FirstName, client.LastName, client.MiddleName, client.Sex, client.PreparationLevel, client.DateOfBirth, client.Email).Scan(&client.ID)
}

func UpdateClient(db *sql.DB, client *Client) error {
	if err := validateClient(client); err != nil {
		return err
	}

	query := `UPDATE "public"."Clients"
			  SET first_name = $1, last_name = $2, middle_name = $3, sex = $4, preparation_level = $5, date_of_birth = $6, email = $7
			  WHERE client_id = $8`
	_, err := db.Exec(query, client.FirstName, client.LastName, client.MiddleName, client.Sex, client.PreparationLevel, client.DateOfBirth, client.Email, client.ID)
	return err
}

func DeleteClient(db *sql.DB, id int) error {
	query := `DELETE FROM "public"."Clients" WHERE client_id = $1`
	_, err := db.Exec(query, id)
	return err
}
