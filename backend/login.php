<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$userEmail = $input['email'] ?? '';
$userPassword = $input['password'] ?? '';

// Validate input
if (empty($userEmail) || empty($userPassword)) {
    echo json_encode(["message" => "Please fill in all fields."]);
    exit();
}

// Query the database
$stmt = $conn->prepare("SELECT UserId, PasswordHash FROM users WHERE Email = :email");
$stmt->bindParam(':email', $userEmail);
$stmt->execute();
$user = $stmt->fetch_assoc();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify password
    if (password_verify($userPassword, $user['PasswordHash'])) {
        echo json_encode(["message" => "Login successful"]);
    } else {
        echo json_encode(["message" => "Invalid email or password."]);
    }
} else {
    echo json_encode(["message" => "Invalid email or password."]);
}
?>