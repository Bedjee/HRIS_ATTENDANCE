import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function EmployeeMultiSelect({ employees, value, onChange }) {
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        const results = employees.filter(emp =>
            `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
            emp.department?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(results);
    }, [search, employees]);

    const selectedEmployees = employees.filter(emp => value.includes(emp.id));


    const toggleEmployee = (id) => {
    if (value.includes(id)) {
        onChange(value.filter(v => v !== id));
    } else {
        onChange([...value, id]);
    }
};

    return (
        <div className="relative mt-1">
            <div className="flex flex-wrap gap-1 p-2 border rounded-md border-gray-300">
                {selectedEmployees.map(emp => (
                    <span key={emp.id} className="inline-flex items-center bg-navy-100 text-navy-800 px-2 py-1 rounded-md text-sm">
                        {emp.first_name} {emp.last_name}
                        <button type="button" onClick={() => toggleEmployee(emp.id)} className="ml-1 text-navy-600 hover:text-navy-900">
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <div className="flex-1 min-w-[150px] relative">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-2 py-1 text-sm border-0 focus:ring-0 bg-transparent"
                        />
                    </div>
                    {search && filtered.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {filtered.map(emp => (
                                <button
                                    key={emp.id}
                                    type="button"
                                    onClick={() => toggleEmployee(emp.id)}
                                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${value.includes(emp.id) ? 'bg-navy-50' : ''}`}
                                >
                                    {emp.first_name} {emp.last_name} ({emp.department?.name || 'Unassigned'})
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
