<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

$host = "localhost";
$db_name = "food_explorer";
$username = "root"; 
$password = "";     

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $exception->getMessage()]);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Login
if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = :username");
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($data->password === $row['password']) {
            echo json_encode(["success" => true, "user_id" => $row['id'], "message" => "Login successful"]);
            exit();
        }
    }
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit();
}

// Get Favorites (Strictly for the logged-in user)
if ($method === 'GET' && $action === 'get_favorites') {
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
    $stmt = $conn->prepare("SELECT * FROM favorites WHERE user_id = :user_id");
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 

// Save Favorite (Attached to the logged-in user)
elseif ($method === 'POST' && $action === 'save_favorite') {
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->meal_id) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO favorites (user_id, meal_id, meal_name, meal_category, meal_area, meal_thumb) 
                      VALUES (:user_id, :meal_id, :meal_name, :meal_category, :meal_area, :meal_thumb)";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(":user_id", $data->user_id);
            $stmt->bindParam(":meal_id", $data->meal_id);
            $stmt->bindParam(":meal_name", $data->meal_name);
            $stmt->bindParam(":meal_category", $data->meal_category);
            $stmt->bindParam(":meal_area", $data->meal_area);
            $stmt->bindParam(":meal_thumb", $data->meal_thumb);
            $stmt->execute();
            http_response_code(201);
            echo json_encode(["message" => "Saved successfully!"]);
        } catch(PDOException $e) {
            http_response_code(400);
            echo json_encode(["message" => "Already in favorites."]);
        }
    }
} 

// Delete Favorite (Ensures the user only deletes their own favorite)
elseif ($method === 'DELETE' && $action === 'delete_favorite') {
    $meal_id = isset($_GET['id']) ? $_GET['id'] : die();
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
    
    $stmt = $conn->prepare("DELETE FROM favorites WHERE meal_id = :meal_id AND user_id = :user_id");
    $stmt->bindParam(":meal_id", $meal_id);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();
    http_response_code(200);
    echo json_encode(["message" => "Removed successfully!"]);
}
?>