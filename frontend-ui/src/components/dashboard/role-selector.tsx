'use client';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Truck, Undo2, Boxes, BarChart3 } from 'lucide-react';

export type UserRole = 'LogisticsManager' | 'ReturnsManager' | 'InventoryAnalyst' | 'General';

interface RoleSelectorProps {
  onRoleChange: (role: UserRole) => void;
  currentRole: UserRole;
}

const roleConfig = {
  LogisticsManager: {
    name: 'Logistics Manager',
    icon: Truck,
    color: 'text-blue-400',
    description: 'Forward shipments & carrier performance',
    permissions: ['forward_shipments', 'carrier_performance', 'delays']
  },
  ReturnsManager: {
    name: 'Returns Manager',
    icon: Undo2,
    color: 'text-orange-400',
    description: 'Returns processing & SLA tracking',
    permissions: ['returns', 'sla_tracking', 'customer_service']
  },
  InventoryAnalyst: {
    name: 'Inventory Analyst',
    icon: Boxes,
    color: 'text-green-400',
    description: 'Stock levels & supplier performance',
    permissions: ['inventory', 'suppliers', 'demand_forecasting']
  },
  General: {
    name: 'General Dashboard',
    icon: BarChart3,
    color: 'text-purple-400',
    description: 'All data & comprehensive view',
    permissions: ['all']
  }
};

export default function RoleSelector({ onRoleChange, currentRole }: RoleSelectorProps) {
  const [role, setRole] = useState<UserRole>(currentRole);

  useEffect(() => {
    // Load role from session storage on mount
    const savedRole = sessionStorage.getItem('user_role') as UserRole;
    if (savedRole && savedRole in roleConfig) {
      setRole(savedRole);
      onRoleChange(savedRole);
    }
  }, [onRoleChange]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    sessionStorage.setItem('user_role', newRole);
    onRoleChange(newRole);
  };

  const currentRoleInfo = roleConfig[role];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg">
          <currentRoleInfo.icon className={`w-5 h-5 ${currentRoleInfo.color}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{currentRoleInfo.name}</h3>
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          </div>
          <p className="text-sm text-gray-400">{currentRoleInfo.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-400" />
        <Select value={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(roleConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <config.icon className={`w-4 h-4 ${config.color}`} />
                  <span>{config.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 