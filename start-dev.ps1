# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev" 