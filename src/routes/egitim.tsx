import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import {
  Accordion,
  Badge,
  Blockquote,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import {
  Bell,
  CreditCard,
  FileCode,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  Users,
  UserCheck,
  Sliders,
  MessageSquare,
  BookOpen,
} from 'lucide-react'

export const Route = createFileRoute('/egitim')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: EgitimPage,
})

interface GuideSection {
  id: string
  icon: typeof LayoutDashboard
  title: string
  description: string
  color: string
  steps: string[]
  tips: string[]
}

const guideSections: GuideSection[] = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Bankacılık sistemi genel durumu ve analitikleri görüntüleme',
    color: 'green',
    steps: [
      'Ana menüden "Dashboard" seçeneğine tıklayın.',
      'Sayfa açıldığında üst kısımda toplam kullanıcı, günlük işlemler, toplam gelir ve aktif kartlar istatistiklerini göreceksiniz.',
      'İşlem Hacmi grafiğinde aylık işlem trendlerini inceleyebilirsiniz.',
      'Gelir Dağılımı donut grafiğinden gelir kaynaklarını görebilirsiniz.',
      'Son İşlemler tablosunda en son gerçekleştirilen işlemleri takip edebilirsiniz.',
    ],
    tips: [
      'Grafiklerin üzerine geldiğinizde detaylı bilgi görebilirsiniz.',
      'İstatistik kartları geçen aya göre yüzdelik değişim gösterir.',
    ],
  },
  {
    id: 'islemler',
    icon: History,
    title: 'İşlemler',
    description: 'İşlem geçmişi ve filtreleme özellikleri',
    color: 'blue',
    steps: [
      'Ana menüden "İşlemler" seçeneğine tıklayın.',
      'Filtreleo panelini açmak için "Filtrele" butonuna tıklayın.',
      'Tarih aralığı, işlem türü ve durum filtrelerini ayarlayın.',
      'Filtreleri uyguladıktan sonra tabloda sonuçları görüntüleyin.',
      'Tablo başlıklarına tıklayarak sütunlara göre sıralama yapabilirsiniz.',
    ],
    tips: [
      'Birden fazla filtre aynı anda kullanılabilir.',
      'İşlem detaylarını görmek için satıra tıklayın.',
    ],
  },
  {
    id: 'duyurular',
    icon: Bell,
    title: 'Duyurular',
    description: 'Duyuru listesi, ekleme, silme ve güncelleme işlemleri',
    color: 'yellow',
    steps: [
      'Ana menüden "Duyurular" seçeneğine tıklayın.',
      'Yeni duyuru eklemek için "Yeni Duyuru" butonunu kullanın.',
      'Duyuru başlığını ve içeriğini girin.',
      'Mevcut duyuruları düzenlemek için kalem simgesine tıklayın.',
      'Duyuruyu silmek için çöp kutusu simgesini kullanın.',
    ],
    tips: [
      'Duyurular otomatik olarak tarihe göre sıralanır.',
      'Aktif/pasif durumunu değiştirerek duyuruyu yayına alabilir veya yayından kaldırabilirsiniz.',
    ],
  },
  {
    id: 'kullanicilar',
    icon: Users,
    title: 'Kullanıcı İşlemleri',
    description: 'Müşteri bilgileri ve güncelleme işlemleri',
    color: 'cyan',
    steps: [
      'Ana menüden "Kullanıcı İşlemleri" seçeneğine tıklayın.',
      'Müşteri listesinde arama yapmak için arama kutusunu kullanın.',
      'Bir müşteriyi seçmek için satıra tıklayın.',
      'Müşteri bilgilerini düzenlemek için "Düzenle" butonuna tıklayın.',
      'Değişiklikleri kaydetmek için "Kaydet" butonunu tıklayın.',
    ],
    tips: [
      'Müşteri numarası, isim veya telefon numarası ile arama yapabilirsiniz.',
      'Tablo başlıklarına tıklayarak sıralama yapabilirsiniz.',
    ],
  },
  {
    id: 'bankacilik-loglari',
    icon: FileCode,
    title: 'Dijital Bankacılık Logları',
    description: 'Müşteri logları zamana göre sıralanmış',
    color: 'teal',
    steps: [
      'Ana menüden "Dijital Bankacılık Logları" seçeneğine tıklayın.',
      'Log kayıtları otomatik olarak en yeniden en eskiye doğru sıralanır.',
      'Belirli bir müşteriye ait logları filtrelemek için arama kutusunu kullanın.',
      'Tarih aralığı filtresi ile belirli dönemlere ait logları görüntüleyin.',
      'Hata durumlarını filtreleyerek sorunları hızlıca tespit edin.',
    ],
    tips: [
      'Her log kaydı zaman damgası içerir.',
      'Hata kodlarına tıklayarak detaylı açıklama görebilirsiniz.',
    ],
  },
  {
    id: 'kartlar',
    icon: CreditCard,
    title: 'Kartlarım',
    description: 'Kredi ve banka kartları yönetimi',
    color: 'orange',
    steps: [
      'Ana menüden "Kartlarım" seçeneğine tıklayın.',
      'Tüm kartlarınızı kart görünümünde listelenmiş olarak göreceksiniz.',
      'Bir kartı seçmek için kartın üzerine tıklayın.',
      'Kart detaylarını görüntülemek için "Detay" butonunu kullanın.',
      'Kart durumunu değiştirmek için ilgili butonu kullanın.',
    ],
    tips: [
      'Aktif ve pasif kartlarınızı ayrı ayrı filtreleyebilirsiniz.',
      'Kart numaraları maskelenmiş olarak gösterilir.',
    ],
  },
  {
    id: 'aktif-kullanicilar',
    icon: UserCheck,
    title: 'Aktif Kullanıcılar',
    description: 'Anlık aktif kullanıcı oturumları',
    color: 'lime',
    steps: [
      'Ana menüden "Aktif Kullanıcılar" seçeneğine tıklayın.',
      'Anlık olarak sistemde bulunan aktif kullanıcıları göreceksiniz.',
      'Kullanıcı oturum bilgilerini görüntülemek için satıra tıklayın.',
      'Oturum süresi ve son aktivite zamanını kontrol edin.',
      'Gerekli durumlarda oturumu sonlandırmak için ilgili butonu kullanın.',
    ],
    tips: [
      'Sayfa otomatik olarak belirli aralıklarla yenilenir.',
      'Manuel yenileme için yenile butonunu kullanabilirsiniz.',
    ],
  },
  {
    id: 'sistem-parametreleri',
    icon: Sliders,
    title: 'Sistem Parametreleri',
    description: 'Uygulama limitleri ve genel ayarlar',
    color: 'violet',
    steps: [
      'Ana menüden "Sistem Parametreleri" seçeneğine tıklayın.',
      'Mevcut parametreleri listeden görüntüleyin.',
      'Bir parametreyi düzenlemek için "Düzenle" butonuna tıklayın.',
      'Yeni değerleri girin ve "Kaydet" butonunu tıklayın.',
      'Değişikliklerin etkili olması için sistemi yenileyin.',
    ],
    tips: [
      'Parametre değişiklikleri tüm sistemi etkiler.',
      'Kritik parametreler için onay gerekebilir.',
    ],
  },
  {
    id: 'mesajlar-ve-etiketler',
    icon: MessageSquare,
    title: 'Sistem Mesajları ve Etiketler',
    description: 'Hata kodları ve arayüz etiketleri',
    color: 'pink',
    steps: [
      'Ana menüden "Sistem Mesajları ve Etiketler" seçeneğine tıklayın.',
      'Hata kodlarını ve mesajlarını listeden görüntüleyin.',
      'Yeni mesaj eklemek için "Yeni Mesaj" butonunu kullanın.',
      'Mevcut mesajları düzenlemek için kalem simgesine tıklayın.',
      'Etiketleri yönetmek için "Etiketler" sekmesine geçin.',
    ],
    tips: [
      'Her hata kodu benzersiz bir tanımlayıcıya sahiptir.',
      'Etiketler farklı diller için tanımlanabilir.',
    ],
  },
  {
    id: 'ayarlar',
    icon: Settings,
    title: 'Ayarlar',
    description: 'Hesap ve bildirim ayarları',
    color: 'gray',
    steps: [
      'Ana menüden "Ayarlar" seçeneğine tıklayın.',
      'Hesap bilgilerinizi görüntüleyin ve düzenleyin.',
      'Bildirim tercihlerinizi ayarlayın.',
      'Tema seçimini yapın (açık/koyu mod).',
      'Değişiklikleri kaydetmek için "Kaydet" butonunu tıklayın.',
    ],
    tips: [
      'Tema tercihi otomatik olarak kaydedilir.',
      'Bildirim ayarları anında etkili olur.',
    ],
  },
  {
    id: 'raporlar',
    icon: FileText,
    title: 'Raporlar',
    description: 'Raporları oluşturun ve dışa aktarın',
    color: 'indigo',
    steps: [
      'Ana menüden "Raporlar" seçeneğine tıklayın.',
      'Oluşturulmuş raporları listeden görüntüleyin.',
      'Yeni rapor oluşturmak için "Yeni Rapor" butonunu kullanın.',
      'Rapor parametrelerini ayarlayın (tarih aralığı, filtreler).',
      'Raporu dışa aktarmak için "Dışa Aktar" butonunu tıklayın.',
    ],
    tips: [
      'Raporlar PDF ve Excel formatında dışa aktarılabilir.',
      'Düzenli raporlar için zamanlama ayarlayabilirsiniz.',
    ],
  },
]

function EgitimPage() {
  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <div>
          <Group gap="md" align="center">
            <ThemeIcon variant="light" color="green" size="xl" radius="md">
              <BookOpen size={28} />
            </ThemeIcon>
            <div>
              <Title order={2}>Eğitim Merkezi</Title>
              <Text c="dimmed">
                Andromeda Bankacılık Sistemi kullanım rehberi
              </Text>
            </div>
          </Group>
          <Paper p="md" mt="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Bu sayfada sistemin tüm modüllerinin nasıl kullanılacağına dair
              adım adım rehberler bulabilirsiniz. Aşağıdaki menülerden
              ilgilendiğiniz konuyu seçerek detaylı bilgi alabilirsiniz.
            </Text>
          </Paper>
        </div>

        <Accordion multiple variant="separated" radius="md">
          {guideSections.map((section) => (
            <Accordion.Item key={section.id} value={section.id}>
              <Accordion.Control>
                <Group gap="md">
                  <ThemeIcon
                    variant="light"
                    color={section.color}
                    size="lg"
                    radius="md"
                  >
                    <section.icon size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{section.title}</Text>
                    <Text size="sm" c="dimmed">
                      {section.description}
                    </Text>
                  </div>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack gap="lg">
                  <div>
                    <Group gap="xs" mb="sm">
                      <Badge variant="light" color={section.color}>
                        Adım Adım
                      </Badge>
                    </Group>
                    <List
                      spacing="sm"
                      size="sm"
                      icon={
                        <ThemeIcon
                          color={section.color}
                          variant="light"
                          size={20}
                          radius="xl"
                        >
                          <Text size="xs" fw={700}>
                            ✓
                          </Text>
                        </ThemeIcon>
                      }
                    >
                      {section.steps.map((step, index) => (
                        <List.Item key={index}>{step}</List.Item>
                      ))}
                    </List>
                  </div>

                  <Divider />

                  <div>
                    <Group gap="xs" mb="sm">
                      <Badge variant="outline" color="green">
                        İpuçları
                      </Badge>
                    </Group>
                    <List
                      spacing="sm"
                      size="sm"
                      icon={
                        <ThemeIcon
                          color="green"
                          variant="light"
                          size={20}
                          radius="xl"
                        >
                          <Text size="xs">💡</Text>
                        </ThemeIcon>
                      }
                    >
                      {section.tips.map((tip, index) => (
                        <List.Item key={index}>{tip}</List.Item>
                      ))}
                    </List>
                  </div>

                  <Blockquote
                    color={section.color}
                    radius="md"
                    p="md"
                    mt="sm"
                  >
                    <Text size="sm">
                      Bu modül hakkında daha fazla bilgi için destek ekibiyle
                      iletişime geçebilirsiniz.
                    </Text>
                  </Blockquote>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Genel Kullanım İpuçları</Title>
            <List spacing="sm" size="sm">
              <List.Item>
                Sol üst köşedeki hamburger menüden tüm modüllere erişebilirsiniz.
              </List.Item>
              <List.Item>
                Sağ üst köşedeki profil menüsünden hesap ayarlarınıza
                ulaşabilirsiniz.
              </List.Item>
              <List.Item>
                Tüm sayfalarda arama ve filtreleme özelliklerini
                kullanabilirsiniz.
              </List.Item>
              <List.Item>
                Tema değiştirmek için profil menüsünden "Tema Değiştir"
                seçeneğini kullanın.
              </List.Item>
              <List.Item>
                Oturumunuzu sonlandırmak için "Çıkış" butonuna tıklayın.
              </List.Item>
            </List>
          </Stack>
        </Paper>
      </Stack>
    </div>
  )
}
