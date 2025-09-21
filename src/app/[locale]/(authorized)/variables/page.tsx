'use client';
import { Trash } from '@/components/Icon/Icon';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function VariablesPage() {
  const [variables, setVariables] = useLocalStorage<
    { key: string; value: string }[]
  >('variables', [{ key: '', value: '' }]);

  const updateVariable = (idx: number, field: string, value: string) => {
    setVariables([
      ...variables.map((h, i) => (i === idx ? { ...h, [field]: value } : h)),
    ]);
  };

  const deleteVariable = (idx: number) => {
    setVariables([...variables.filter((_, i) => i !== idx)]);
  };

  const addVariable = () => {
    setVariables([...variables, { key: '', value: '' }]);
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[300px] p-4 rounded-lg bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Variables</h1>
      <table className="table">
        <thead className="table-header">
          <tr className="tr">
            <th className="table-cell">Key</th>
            <th className="table-cell">Value</th>
            <th className="table-cell"></th>
          </tr>
        </thead>
        <tbody className="table-body">
          {variables.map(
            (variable, idx) =>
              variable && (
                <tr key={idx} className="tr">
                  <td className="table-cell">
                    <input
                      value={variable.key}
                      onChange={(e) =>
                        updateVariable(idx, 'key', e.target.value)
                      }
                      placeholder="Key"
                      className="form-input"
                    />
                  </td>
                  <td className="table-cell">
                    <input
                      value={variable.value}
                      onChange={(e) =>
                        updateVariable(idx, 'value', e.target.value)
                      }
                      placeholder="Value"
                      className="form-input"
                    />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => deleteVariable(idx)}
                        className="fill-red-400 hover:fill-red-300 cursor-pointer"
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      <button className="btn-action mt-4" onClick={addVariable}>
        Add variable
      </button>
    </div>
  );
}
