<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// config.php: DB connection settings
include 'config.php';

// Get JSON data from React Front-End (POST request)
$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode(["error" => "Email and Password are required."]);
    exit;
}

// Check if email already exists
$query = "SELECT * FROM users WHERE Email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["error" => "Email already in use."]);
    exit;
}

// Hash the password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insert user into the database
$query = "INSERT INTO users (Email, PasswordHash) VALUES (?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $email, $passwordHash);

if ($stmt->execute()) {
    echo json_encode(["message" => "Account created successfully!"]);
} else {
    echo json_encode(["error" => "An error occurred. Please try again."]);
}
?>
