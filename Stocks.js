//datos de prueba

const inventory ={
  "inventory": [
    {"sku": "A01","stock": { "count": "12","blocked": 0}},
    {"sku": "A02","stock": { "count": "10","blocked": 2}},
    {"sku": "A03", "stock": { "count": "8","blocked": 0}},
  ]
}

const orders= {
  "orders": [
    {
      "id": "1",
      "order_lines": [{"sku": "A01","quantity": 1}, {"sku": "A02","quantity":20}]
    },
    {
      "id": "2",
      "order_lines": [{"sku": "A01","quantity": 1}]
    },
    {
      "id": "3",
      "order_lines": [{"sku": "A09","quantity": 99}]
    },
  ]
}

function calculateStock(inv_param, orders_param) {
  const stocks = [];

  // Inicializo la 'tabla' de stocks para calcular sobre esos valores:
  inv_param.inventory.map(item => {
    stocks[item.sku] = {
      sku: item.sku,  //dato
      count: Number(item.stock.count), //dato
      blocked: item.stock.blocked, //dato
      booked:  0, // inicialmente 0 , luego calculo con los datos de las órdenes
      missing:  0, // inicialmente , luego calculo con los datos de las órdenes
      available: Number(item.stock.count) - item.stock.blocked 
    };
  });

  console.log('stocks inicialmente', stocks);

/*   stocks inicialmente [
    A01: {
      sku: 'A01',      
      count: 12,       
      blocked: 0,      
      booked: 0,       
      missing: 0,      
      available: 12    
    },
    A02: {
      sku: 'A02',      
      count: 10,       
      blocked: 2,      
      booked: 0,       
      missing: 0,      
      available: 8     
    },
    A03: {
      sku: 'A03',      
      count: 8,        
      blocked: 0,      
      booked: 0,       
      missing: 0,      
      available: 8     
    } */

  // Obtengo las líneas de cada orden para usar el 'sku' y las cantidades requeridas
  const lines = orders_param.orders.flatMap(order => order.order_lines);
  console.log("lines", lines);
/* 
  lines [
    { sku: 'A01', quantity: 1 },
    { sku: 'A02', quantity: 20 },
    { sku: 'A01', quantity: 1 },
    { sku: 'A09', quantity: 99 }
  ]
 */
  // Recorro cada línea de orden para procesar el stock
  lines.forEach(line => {
    if (stocks[line.sku]) { 
      // El stock disponible será la diferencia entre las existencias y la cantidad bloqueada
      const available = stocks[line.sku].count - stocks[line.sku].blocked;

      // Si el stock disponible es mayor o igual a la cantidad requerida en la orden, reservo esa cantidad en la 'columna' 'booked'
      if (line.quantity <= available) {
        stocks[line.sku].booked += line.quantity;
      } else {
        // Si no alcanza el stock disponible, reservo todo lo que hay disponible y pongo la diferencia en la 'columna' 'missing'
        stocks[line.sku].booked = available;
        stocks[line.sku].missing = line.quantity - available;
      }

      // Calculo el 'available' como la diferencia entre los disponibles que había (count - blocked) y los reservados en la última orden (booked) 
      stocks[line.sku].available = stocks[line.sku].count - stocks[line.sku].blocked - stocks[line.sku].booked;
    } else {
      console.log(`No existe el item con SKU: ${line.sku}`);
    }
  });

  return Object.values(stocks);
}

console.log('stocks después de procesar', calculateStock(inventory, orders));

/* stocks después de procesar [
  {
    sku: 'A01',
    count: 12,
    blocked: 0,
    booked: 2,
    missing: 0,
    available: 10
  },
  {
    sku: 'A02',
    count: 10,
    blocked: 2,
    booked: 8,
    missing: 12,
    available: 0
  },
  {
    sku: 'A03',
    count: 8,
    blocked: 0,
    booked: 0,
    missing: 0,
    available: 8
  }
] */