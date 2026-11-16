import React from 'react';

export const OrdersManager: React.FC = () => {
  const orders = [
    { id: '#3D-109', client: 'Jan Kowalski', file: 'uchwyt_biurko.stl', material: 'PLA (Czarny)', status: 'W druku' },
    { id: '#3D-108', client: 'Anna Nowak', file: 'obudowa_esp32.step', material: 'PETG (Biały)', status: 'Oczekuje' },
    { id: '#3D-107', client: 'Piotr Zieliński', file: 'figurka_test.3mf', material: 'ABS (Czerwony)', status: 'Ukończone' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Zamówienia i pliki 3D</h2>
        <p className="text-slate-400 text-sm">Zarządzaj napływającymi zleceniami druku.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">ID</th>
              <th className="p-4">Klient</th>
              <th className="p-4">Plik</th>
              <th className="p-4">Materiał</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-white">{order.id}</td>
                <td className="p-4">{order.client}</td>
                <td className="p-4 text-blue-400 font-mono text-xs">{order.file}</td>
                <td className="p-4">{order.material}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'W druku' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    order.status === 'Ukończone' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};