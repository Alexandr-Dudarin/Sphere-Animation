import type { WaterRippleVariant } from '../components/WaterRippleVisual';

export const waterVariants: { id: WaterRippleVariant; title: string; label: string; description: string }[] = [
  { id: 'droplet', title: 'Падающая капля', label: 'FALLING DROP / 01',
    description: 'Капля медленно собирается на краю, отрывается и оставляет тонкие круги на воде.' },
  { id: 'ripples', title: 'Только круги', label: 'WATER RIPPLE / 02',
    description: 'Спокойный ритм: волны расходятся от центра и постепенно растворяются в темноте.' },
  { id: 'rain', title: 'Дождь', label: 'RAIN / 03',
    description: 'Лёгкий дождь рисует пересекающиеся круги. У каждой капли своя точка падения.' },
  { id: 'interactive', title: 'Касание воды', label: 'TOUCH THE WATER / 04',
    description: 'Проведи курсором по воде или коснись её. С клавиатуры — Enter или пробел, когда выделена сцена.' },
  { id: 'crown', title: 'Всплеск-корона', label: 'SPLASH CROWN / 05',
    description: 'После удара капли поднимается тонкая водяная корона, опадает и уступает место кругам.' },
  { id: 'waterfall', title: 'Водопад', label: 'WATERFALL / 06',
    description: 'Переплетающиеся потоки падают с края. Внизу поднимаются водяные короны и расходится рябь.' },
];
