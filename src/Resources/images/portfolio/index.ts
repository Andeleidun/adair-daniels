import agechartOriginal from './agechart.jpg';
import agechartThumbnail from './thumbnails/agechart.jpg';
import experiencechartOriginal from './experiencechart.jpg';
import experiencechartThumbnail from './thumbnails/experiencechart.jpg';
import genderchartOriginal from './genderchart.jpg';
import genderchartThumbnail from './thumbnails/genderchart.jpg';
import ketomate10kOriginal from './ketomate10k.jpg';
import ketomate10kThumbnail from './thumbnails/ketomate10k.jpg';
import kmactiveOriginal from './km_active.jpg';
import kmactiveThumbnail from './thumbnails/km_active.jpg';
import kmadvancedOriginal from './km_advanced.jpg';
import kmadvancedThumbnail from './thumbnails/km_advanced.jpg';
import kmbodyfatOriginal from './km_bodyfat.jpg';
import kmbodyfatThumbnail from './thumbnails/km_bodyfat.jpg';
import kmfaqOriginal from './km_faq.jpg';
import kmfaqThumbnail from './thumbnails/km_faq.jpg';
import kmhomeOriginal from './km_home.jpg';
import kmhomeThumbnail from './thumbnails/km_home.jpg';
import kmintroOriginal from './km_intro.jpg';
import kmintroThumbnail from './thumbnails/km_intro.jpg';
import kmmenuOriginal from './km_menu.jpg';
import kmmenuThumbnail from './thumbnails/km_menu.jpg';
import kmresultsOriginal from './km_results.jpg';
import kmresultsThumbnail from './thumbnails/km_results.jpg';
import metricmediaOriginal from './metricmedia.jpg';
import metricmediaThumbnail from './thumbnails/metricmedia.jpg';
import metricmediaspeedOriginal from './metricmediaspeed.jpg';
import metricmediaspeedThumbnail from './thumbnails/metricmediaspeed.jpg';
import mylifterOriginal from './mylifter.jpg';
import mylifterThumbnail from './thumbnails/mylifter.jpg';
import phoenixstoneOriginal from './phoenixstone.jpg';
import phoenixstoneThumbnail from './thumbnails/phoenixstone.jpg';
import phoenixstonespeedOriginal from './phoenixstone_speed.jpg';
import phoenixstonespeedThumbnail from './thumbnails/phoenixstone_speed.jpg';
import vanderhallOriginal from './vanderhall.jpg';
import vanderhallThumbnail from './thumbnails/vanderhall.jpg';

export interface PortfolioAsset {
  readonly original: string;
  readonly width: number;
  readonly height: number;
  readonly thumbnail: string;
  readonly thumbnailWidth: number;
  readonly thumbnailHeight: number;
}

const phoneAsset = (original: string, thumbnail: string): PortfolioAsset => ({
  original,
  width: 358,
  height: 663,
  thumbnail,
  thumbnailWidth: 69,
  thumbnailHeight: 128,
});

const chartAsset = (original: string, thumbnail: string): PortfolioAsset => ({
  original,
  width: 1420,
  height: 329,
  thumbnail,
  thumbnailWidth: 128,
  thumbnailHeight: 30,
});

const desktopAsset = (original: string, thumbnail: string): PortfolioAsset => ({
  original,
  width: 1420,
  height: 663,
  thumbnail,
  thumbnailWidth: 128,
  thumbnailHeight: 60,
});

const agechart = chartAsset(agechartOriginal, agechartThumbnail);
const experiencechart = chartAsset(
  experiencechartOriginal,
  experiencechartThumbnail
);
const genderchart = chartAsset(genderchartOriginal, genderchartThumbnail);
const ketomate10k = phoneAsset(ketomate10kOriginal, ketomate10kThumbnail);
const kmactive = phoneAsset(kmactiveOriginal, kmactiveThumbnail);
const kmadvanced = phoneAsset(kmadvancedOriginal, kmadvancedThumbnail);
const kmbodyfat = phoneAsset(kmbodyfatOriginal, kmbodyfatThumbnail);
const kmfaq = phoneAsset(kmfaqOriginal, kmfaqThumbnail);
const kmhome = phoneAsset(kmhomeOriginal, kmhomeThumbnail);
const kmintro = phoneAsset(kmintroOriginal, kmintroThumbnail);
const kmmenu = phoneAsset(kmmenuOriginal, kmmenuThumbnail);
const kmresults = phoneAsset(kmresultsOriginal, kmresultsThumbnail);
const metricmedia = desktopAsset(metricmediaOriginal, metricmediaThumbnail);
const metricmediaspeed = desktopAsset(
  metricmediaspeedOriginal,
  metricmediaspeedThumbnail
);
const mylifter = desktopAsset(mylifterOriginal, mylifterThumbnail);
const phoenixstone = desktopAsset(phoenixstoneOriginal, phoenixstoneThumbnail);
const phoenixstonespeed = desktopAsset(
  phoenixstonespeedOriginal,
  phoenixstonespeedThumbnail
);
const vanderhall = desktopAsset(vanderhallOriginal, vanderhallThumbnail);

export {
  agechart,
  experiencechart,
  genderchart,
  ketomate10k,
  kmactive,
  kmadvanced,
  kmbodyfat,
  kmfaq,
  kmhome,
  kmintro,
  kmmenu,
  kmresults,
  metricmedia,
  metricmediaspeed,
  mylifter,
  phoenixstone,
  phoenixstonespeed,
  vanderhall,
};
