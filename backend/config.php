<?php
$host = "dbhost.cs.man.ac.uk"; // Change to your database host if needed
$dbname = "2024_comp10120_cm5"; // The database name you created
$username = "y46354js"; // Default for XAMPP/MAMP
$password = "G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs"; // Default for XAMPP (leave blank)

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connected to MySQL successfully!";
}
?>
