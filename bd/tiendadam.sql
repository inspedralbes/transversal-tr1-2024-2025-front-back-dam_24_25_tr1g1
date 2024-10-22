-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-10-2024 a las 09:18:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tiendadam`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comandes`
--

CREATE TABLE `comandes` (
  `id` int(11) NOT NULL,
  `data` date DEFAULT NULL,
  `contingut` varchar(500) DEFAULT NULL,
  `direccio` varchar(255) DEFAULT NULL,
  `estat` enum('En preparació','En cuina','En camí','Recollit') DEFAULT NULL,
  `client` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productes`
--

CREATE TABLE `productes` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `descripcio` varchar(255) NOT NULL,
  `fotoRuta` varchar(255) NOT NULL,
  `preu` float NOT NULL,
  `oferta` float DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `halal` tinyint(1) DEFAULT NULL,
  `vegan` tinyint(1) DEFAULT NULL,
  `gluten` tinyint(1) DEFAULT NULL,
  `lactosa` tinyint(1) DEFAULT NULL,
  `crustacais` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuaris`
--

CREATE TABLE `usuaris` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `correu` varchar(255) NOT NULL,
  `contrasenya` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `halal` tinyint(1) NOT NULL,
  `vegan` tinyint(1) NOT NULL,
  `gluten` tinyint(1) NOT NULL,
  `lactosa` tinyint(1) NOT NULL,
  `crustacis` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Indices de la tabla `comandes`
--
ALTER TABLE `comandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client` (`client`);

--
-- Indices de la tabla `productes`
--
ALTER TABLE `productes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- Indices de la tabla `usuaris`
--
ALTER TABLE `usuaris`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correu` (`correu`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comandes`
--
ALTER TABLE `comandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productes`
--
ALTER TABLE `productes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuaris`
--
ALTER TABLE `usuaris`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comandes`
--
ALTER TABLE `comandes`
  ADD CONSTRAINT `comandes_ibfk_1` FOREIGN KEY (`client`) REFERENCES `usuaris` (`id`);

--
-- Filtros para la tabla `productes`
--
ALTER TABLE `productes`
  ADD CONSTRAINT `productes_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
