// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

/// @title Contrato de Transferencia de SepoliaETH - 2

/// @notice Este contrato permite la transferencia de SepoliaETH entre cuentas.
contract TransferenciaSepoliaETH {
    address public propietario; // Dirección del propietario del contrato
    mapping(address => uint256) public saldos; // Saldo de SepoliaETH de cada cuenta
    
    struct Transaccion {
        address desde;
        address hacia;
        uint256 cantidad;
        uint256 fecha;
    }
    
    Transaccion[] public historialTransacciones; // Historial de transacciones
    
    /// @notice Evento que se emite cuando se realiza una transferencia de SepoliaETH
    event Transferencia(address indexed desde, address indexed hacia, uint256 cantidad);
    
    /// @notice Constructor del contrato, establece al creador como propietario inicial
    constructor() {
        propietario = msg.sender;
    }
    
    /// @notice Función para transferir SepoliaETH a otra cuenta
    /// @param _hacia La dirección del destinatario de la transferencia
    function transferir(address _hacia) public {
        uint256 _cantidad = 1; // 1 SepoliaETH
        require(saldos[msg.sender] >= _cantidad, "Saldo insuficiente");
        
        saldos[msg.sender] -= _cantidad;
        saldos[_hacia] += _cantidad;
        
        emit Transferencia(msg.sender, _hacia, _cantidad);
        
        // Registrar la transacción en el historial
        historialTransacciones.push(Transaccion(msg.sender, _hacia, _cantidad, block.timestamp));
    }
    
    /// @notice Función para obtener el saldo de SepoliaETH de una cuenta
    /// @param _cuenta La dirección de la cuenta de la que se desea obtener el saldo
    /// @return El saldo de SepoliaETH de la cuenta especificada
    function obtenerSaldo(address _cuenta) public view returns (uint256) {
        return saldos[_cuenta];
    }
    
    /// @notice Función para obtener el número de transacciones registradas
    /// @return El número de transacciones en el historial
    function obtenerNumeroTransacciones() public view returns (uint256) {
        return historialTransacciones.length;
    }
    
    /// @notice Función para obtener los detalles de una transacción específica del historial
    /// @param _indice El índice de la transacción en el historial
    /// @return Los detalles de la transacción (desde, hacia, cantidad, fecha)
    function obtenerDetallesTransaccion(uint256 _indice) public view returns (address, address, uint256, uint256) {
        require(_indice < historialTransacciones.length, "Índice fuera de rango");
        
        Transaccion memory transaccion = historialTransacciones[_indice];
        return (transaccion.desde, transaccion.hacia, transaccion.cantidad, transaccion.fecha);
    }
    
    /// @notice Función fallback que permite recibir SepoliaETH
    receive() external payable {
        saldos[msg.sender] += msg.value;
    }
}
