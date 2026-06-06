import { useCallback, useEffect, useState } from 'react';

export function useCrud(service, initialParams = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState({ number: 0, size: 10, totalPages: 1, totalElements: 0 });
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (override = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await service.list({ page: page.number, size: page.size, ...params, ...override });
      const content = data.content || data;
      setItems(content);
      setPage((old) => ({
        ...old,
        number: data.number ?? override.page ?? old.number,
        size: data.size ?? old.size,
        totalPages: data.totalPages ?? 1,
        totalElements: data.totalElements ?? content.length
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }, [service, params, page.number, page.size]);

  useEffect(() => { load(); }, [load]);

  const save = async (record) => {
    if (record.id) await service.update(record.id, record);
    else await service.create(record);
    await load();
  };

  const remove = async (id) => {
    await service.remove(id);
    await load();
  };

  return { items, loading, error, page, params, setParams, load, save, remove, setPage };
}
