#!/bin/bash

cd ./services/site
go mod tidy
go build ./cmd/main.go
./main
