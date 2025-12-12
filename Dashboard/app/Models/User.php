<?php
declare(strict_types=1);

class User
{
    private const DB_PATH = __DIR__ . '/../config/database.db';

    /** @var PDO */
    private $conn;

    public function __construct()
    {
        $this->initDb();
    }

    /**
     * Inicializa la conexión PDO (lazy).
     *
     * @return PDO
     */
    private function getConnection(): PDO
    {
        if (!isset($this->conn)) {
            $host = '127.0.0.1';
            $port = 3306;
            $db   = 'sistema_usuarios';
            $user = 'appuser';      
            $pass = 'AppPass123!';  

            $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

            $this->conn = new PDO($dsn, $user, $pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


        }
        return $this->conn;
    }

    private function initDb(): void
    {
        try {
            $conn = $this->getConnection();

            $sql = <<<SQL
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo INTEGER DEFAULT 1
)
SQL;
            $conn->exec($sql);
        } catch (PDOException $e) {
            error_log('Error al crear la base de datos: ' . $e->getMessage());
        }
    }

    /**
     * @param string $password
     * @return string
     */
    private function hash_password(string $password): string
    {
        return hash('sha256', $password);
    }

    /**
     * Valida el formato del email.
     * 
     * @param string $email
     * @return bool
     */
    public function validate_email(string $email): bool
    {
        return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Valida el formato del usuario.
     * 
     * @param string $usuario
     * @return array [bool $isValid, string $message]
     */
    public function validate_username(string $usuario): array
    {
        if (strlen($usuario) < 3 || strlen($usuario) > 20) {
            return [false, 'El usuario debe tener entre 3 y 20 caracteres'];
        }
        if (!ctype_alnum($usuario)) {
            return [false, 'El usuario solo puede contener letras y números'];
        }
        return [true, 'Usuario válido'];
    }

    /**
     * Valida la fortaleza de la contraseña.
     * Retorna [bool, string] 
     *
     * @param string $password
     * @return array [bool $isValid, string $message]
     */
    public function validate_password(string $password): array
    {
        if (strlen($password) < 6) {
            return [false, 'La contraseña debe tener al menos 6 caracteres'];
        }
        return [true, 'Contraseña válida'];
    }

    /**
     * Registra un nuevo usuario.
     * Replica register_user(usuario, email, password)
     * y retorna [bool, string]
     *
     * @param string $usuario
     * @param string $email
     * @param string $password
     * @return array [bool $success, string $message]
     */
    public function register_user(string $usuario, string $email, string $password): array
    {
        try {
            // Validaciones
            [$isValid, $msg] = $this->validate_username($usuario);
            if (!$isValid) {
                return [false, $msg];
            }

            if (!$this->validate_email($email)) {
                return [false, 'Email inválido'];
            }

            [$isValid, $msg] = $this->validate_password($password);
            if (!$isValid) {
                return [false, $msg];
            }

            $hashedPassword = $this->hash_password($password);

            $conn = $this->getConnection();
            $stmt = $conn->prepare('
                INSERT INTO users (usuario, email, contrasena)
                VALUES (:usuario, :email, :contrasena)
            ');
            $stmt->execute([
                ':usuario'    => $usuario,
                ':email'      => $email,
                ':contrasena' => $hashedPassword,
            ]);

            return [true, 'Usuario registrado exitosamente'];
        } catch (PDOException $e) {
            // UNIQUE constraint -> usuario o email ya están registrados
            if ((int) $e->getCode() === 23000) {
                return [false, 'El usuario o email ya está registrado'];
            }
            return [false, 'Error al registrar usuario: ' . $e->getMessage()];
        } catch (Throwable $e) {
            return [false, 'Error al registrar usuario: ' . $e->getMessage()];
        }
    }

    /**
     * Verifica las credenciales del usuario.
     * - True, {id, usuario, email} si OK
     * - False, 'mensaje' si error.
     *
     * @param string $usuario
     * @param string $password
     * @return array [bool $success, mixed $dataOrMessage]
     */
    public function verify_user(string $usuario, string $password): array
    {
        try {
            $conn = $this->getConnection();

            $hashedPassword = $this->hash_password($password);

            $stmt = $conn->prepare('
                SELECT id, usuario, email FROM users
                WHERE usuario = :usuario
                  AND contrasena = :contrasena
                  AND activo = 1
            ');
            $stmt->execute([
                ':usuario'    => $usuario,
                ':contrasena' => $hashedPassword,
            ]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                return [true, [
                    'id'      => (int) $user['id'],
                    'usuario' => $user['usuario'],
                    'email'   => $user['email'],
                ]];
            }

            return [false, 'Usuario o contraseña incorrectos'];
        } catch (Throwable $e) {
            return [false, 'Error al verificar usuario: ' . $e->getMessage()];
        }
    }

    /**
     * Obtiene un usuario por su email.
     * - True, {id, usuario, email} si existe
     * - False, 'Email no registrado' si no.
     *
     * @param string $email
     * @return array [bool $success, mixed $dataOrMessage]
     */
    public function get_user_by_email(string $email): array
    {
        try {
            $conn = $this->getConnection();

            $stmt = $conn->prepare('
                SELECT id, usuario, email FROM users
                WHERE email = :email
                  AND activo = 1
            ');
            $stmt->execute([':email' => $email]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                return [true, [
                    'id'      => (int) $user['id'],
                    'usuario' => $user['usuario'],
                    'email'   => $user['email'],
                ]];
            }

            return [false, 'Email no registrado'];
        } catch (Throwable $e) {
            return [false, 'Error al buscar usuario: ' . $e->getMessage()];
        }
    }

    /**
     * Actualiza la contraseña de un usuario.
     * - True, 'Contraseña actualizada exitosamente'
     * - False, 'Email no encontrado' o mensaje de error.
     *
     * @param string $email
     * @param string $newPassword
     * @return array [bool $success, string $message]
     */
    public function update_password(string $email, string $newPassword): array
    {
        try {
            [$isValid, $msg] = $this->validate_password($newPassword);
            if (!$isValid) {
                return [false, $msg];
            }

            $hashedPassword = $this->hash_password($newPassword);

            $conn = $this->getConnection();
            $stmt = $conn->prepare('
                UPDATE users
                   SET contrasena = :contrasena
                 WHERE email = :email
                   AND activo = 1
            ');
            $stmt->execute([
                ':contrasena' => $hashedPassword,
                ':email'      => $email,
            ]);

            if ($stmt->rowCount() > 0) {
                return [true, 'Contraseña actualizada exitosamente'];
            }

            return [false, 'Email no encontrado'];
        } catch (Throwable $e) {
            return [false, 'Error al actualizar contraseña: ' . $e->getMessage()];
        }
    }

    /**
     * Verifica si un usuario existe (por usuario o por usuario/email).
     *
     * @param string      $usuario
     * @param string|null $email
     * @return bool
     */
    public function user_exists(string $usuario, ?string $email = null): bool
    {
        try {
            $conn = $this->getConnection();

            if ($email !== null) {
                $stmt = $conn->prepare('
                    SELECT id FROM users
                    WHERE usuario = :usuario OR email = :email
                ');
                $stmt->execute([
                    ':usuario' => $usuario,
                    ':email'   => $email,
                ]);
            } else {
                $stmt = $conn->prepare('
                    SELECT id FROM users
                    WHERE usuario = :usuario
                ');
                $stmt->execute([':usuario' => $usuario]);
            }

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user !== false;
        } catch (Throwable $e) {
            error_log('Error al verificar usuario: ' . $e->getMessage());
            return false;
        }
    }
}
