import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import { notifications } from '@mantine/notifications'

export function useDuyurular() {
  return useQuery({
    queryKey: ['duyurular'],
    queryFn: api.duyurular.list,
  })
}

export function useDuyuruCreate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.duyurular.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duyurular'] })
      notifications.show({
        title: 'Başarılı',
        message: 'Duyuru başarıyla eklendi',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Hata',
        message: 'Duyuru eklenirken hata oluştu',
        color: 'red',
      })
    },
  })
}

export function useDuyuruUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Parameters<typeof api.duyurular.update>[1]
    }) => api.duyurular.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duyurular'] })
      notifications.show({
        title: 'Başarılı',
        message: 'Duyuru güncellendi',
        color: 'green',
      })
    },
  })
}

export function useDuyuruDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.duyurular.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duyurular'] })
      notifications.show({
        title: 'Başarılı',
        message: 'Duyuru silindi',
        color: 'green',
      })
    },
  })
}

export function useKullanicilar() {
  return useQuery({
    queryKey: ['kullanicilar'],
    queryFn: api.kullanicilar.list,
  })
}

export function useKullaniciUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Parameters<typeof api.kullanicilar.update>[1]
    }) => api.kullanicilar.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kullanicilar'] })
      notifications.show({
        title: 'Başarılı',
        message: 'Kullanıcı güncellendi',
        color: 'green',
      })
    },
  })
}

export function useKullaniciDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.kullanicilar.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kullanicilar'] })
      notifications.show({
        title: 'Başarılı',
        message: 'Kullanıcı silindi',
        color: 'green',
      })
    },
  })
}

export function useBankacilikLoglari() {
  return useQuery({
    queryKey: ['bankacilik-loglari'],
    queryFn: api.bankacilikLoglari.list,
  })
}

export function useKrediKartlari() {
  return useQuery({
    queryKey: ['kredi-kartlari'],
    queryFn: api.krediKartlari.list,
  })
}

export function useLoginKayitlari() {
  return useQuery({
    queryKey: ['login-kayitlari'],
    queryFn: api.loginKayitlari.list,
  })
}

export function useTelefonModelleri() {
  return useQuery({
    queryKey: ['telefon-modelleri'],
    queryFn: api.telefonModelleri.list,
  })
}
