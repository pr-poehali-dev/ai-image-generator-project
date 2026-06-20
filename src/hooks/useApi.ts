import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { GenerateParams } from '@/lib/api';
import { toast } from 'sonner';

export const useGallery = () =>
  useQuery({ queryKey: ['gallery'], queryFn: api.gallery, staleTime: 10_000 });

export const useFavorites = () =>
  useQuery({ queryKey: ['favorites'], queryFn: api.favorites, staleTime: 10_000 });

export const useHistory = () =>
  useQuery({ queryKey: ['history'], queryFn: api.history, staleTime: 5_000 });

export const useProviders = () =>
  useQuery({ queryKey: ['providers'], queryFn: api.providers, staleTime: 60_000 });

export const useStyles = () =>
  useQuery({ queryKey: ['styles'], queryFn: api.styles, staleTime: 60_000 });

export const useStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: api.stats, staleTime: 5_000 });

export const useGenerate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: GenerateParams) => api.generate(params),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['gallery'] });
      qc.invalidateQueries({ queryKey: ['history'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      if (res.note) {
        toast.info(res.note);
      } else if (res.used_real_api) {
        toast.success('Изображение создано через ' + res.provider);
      } else {
        toast.success('Изображение готово!');
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (image_id: number) => api.toggleFavorite(image_id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['gallery'] });
      qc.invalidateQueries({ queryKey: ['favorites'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast(res.is_favorite ? 'Добавлено в избранное' : 'Убрано из избранного');
    },
  });
};

export const useLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (image_id: number) => api.like(image_id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};
