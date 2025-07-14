import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { notFound } from 'next/navigation';

export default async function ReportPage({ params }: { params: { file: string } }) {
    const fileName = params.file + '.csv';
    const filePath = path.join(process.cwd(), 'public', 'reports', fileName);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const csvData = fs.readFileSync(filePath, 'utf8');
    const { data } = Papa.parse<string[]>(csvData.trim(), { skipEmptyLines: true });

    return (
        <div className="p-10 text-white">
            <h1 className="text-2xl font-bold mb-4 capitalize">Report: {params.file}</h1>
            <div className="overflow-x-auto">
                <table className="border-collapse border border-slate-700 w-full">
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-slate-700">
                                {row.map((cell, j) => (
                                    <td key={j} className="border border-slate-700 px-4 py-2 whitespace-nowrap">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
