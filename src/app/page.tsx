"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const API = "/api";

/* ── Icons ── */
function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const s = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };
  switch (name) {
    case "image": return <svg {...s}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
    case "video": return <svg {...s}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>;
    case "copy": return <svg {...s}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
    case "trending": return <svg {...s}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
    case "wand": return <svg {...s}><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>;
    case "search": return <svg {...s}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "upload": return <svg {...s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
    case "settings": return <svg {...s}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "play": return <svg {...s}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "eye": return <svg {...s}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "heart": return <svg {...s}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
    case "sparkles": return <svg {...s}><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/></svg>;
    case "send": return <svg {...s}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
    case "bot": return <svg {...s}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
    case "user": return <svg {...s}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "loader": return <svg {...s} className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
    case "plus-image": return <svg {...s}><rect width="20" height="20" x="2" y="2" rx="4" ry="4"/><path d="M14 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4"/><path d="M12 13v4"/><circle cx="8" cy="14" r="1"/></svg>;
    case "x": return <svg {...s}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    case "star": return <svg {...s}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></svg>;
    case "upload-cloud": return <svg {...s}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
    case "film": return <svg {...s}><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/><line x1="17" x2="22" y1="17" y2="17"/></svg>;
    default: return <span />;
  }
}

/* ── Types ── */
interface Task { id: string; task_id?: string; status: string; risk_level?: string; created_at: string; }
interface TrendingItem { id: number; title: string; thumb: string; views: string; likes: string; country: string; category: string; videoType: string; }
interface StyleOption { id: number; name: string; desc: string; emoji: string; }

// 11种风格（对应Obsidian模板）
const STYLES: StyleOption[] = [
  { id: 1, name: "真实街拍", desc: "城市街道·夕阳·INS风", emoji: "🏙️" },
  { id: 2, name: "靠墙拍照", desc: "砖墙·午后阳光", emoji: "🧱" },
  { id: 3, name: "客厅自拍", desc: "落地窗·室内·3:4", emoji: "🏠" },
  { id: 4, name: "江边摆拍", desc: "高层露台·黄昏江景", emoji: "🌅" },
  { id: 5, name: "高级影棚", desc: "影棚硬照·杂志封面", emoji: "📸" },
  { id: 6, name: "摩纳哥露台", desc: "地中海悬崖别墅·老钱风", emoji: "🏰" },
  { id: 7, name: "迪拜游艇", desc: "滨海码头·富豪松弛感", emoji: "🛥️" },
  { id: 8, name: "高尔夫球场", desc: "欧洲私人球场·贵族矜贵", emoji: "⛳" },
  { id: 9, name: "湖畔码头", desc: "科莫湖私人码头·成熟贵气", emoji: "🌊" },
  { id: 10, name: "巴黎街头", desc: "法式咖啡馆·慵懒时髦", emoji: "☕" },
  { id: 11, name: "老钱风影棚", desc: "哈苏中画幅·极简暖调", emoji: "✨" },
];

// 风格对应的完整提示词（从Obsidian模板提取）
const STYLE_PROMPTS: Record<number, { image: string; video: string }> = {
  1: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，对标小红书INS爆款穿搭图风格，真人写实摄影。【主体】一位25岁亚洲年轻男性，五官精致，黑色短发，上身上衣下身裤子完整穿搭，面料褶皱纹理真实呈现。【姿态表情】松弛站立，插兜或抱臂，自然日常，视线落向镜头，嘴角扬着痞帅笑意神态帅气阳光。【背景】城市街道，包含路边有人行道和绿化带，种着行道树，现代化摩天大楼玻璃幕墙。【光影】自然夕阳落日光影效果，夕阳光从人物正面射过来，照亮了人物的穿搭细节，衣服的纹理和质感在光照下显得非常有光泽，地面和身上有淡淡的投影，光感通透，没有强烈的阴影。【画质】8K超高清，清晰呈现面料的纹理和层次，画面风格日常随性，色调清晰，随手拍，还原逛街后街边自拍的生活氛围，衣服细节保持不变。比例9:16",
    video: "A handsome Asian man walking slowly on a city street at golden hour, relaxed natural expression, warm sunset light from side, street photography style, quiet luxury aesthetic. Minimal movement, candid vibe."
  },
  2: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，对标小红书INS爆款穿搭图风格，真人写实摄影。【场景】美式复古红砖墙背景，午后14点斜射阳光在墙面留下斑驳光影，侧逆光人像。【主体】一位25岁亚洲年轻男性，精致五官，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，商务休闲工装风，衣料褶皱纹理真实呈现。【姿态表情】松弛靠在墙边，插兜或抱臂，自然日常。【光影】下午14点阳光，侧逆光斜射45度，光影轮廓分明。【画质】8K超高清，红砖墙肌理清晰可见，午后阳光暖调，清晰通透无噪点，真实自然无AI感。",
    video: "A handsome Asian man leaning against a red brick wall, relaxed pose, hand in pocket, afternoon sunlight casting soft shadows, natural candid expression, brick wall texture visible. Quiet luxury street style."
  },
  3: {
    image: "（画面比例：3:4竖屏构图），极致超清画质，客厅自拍风格，对标小红书爆款穿搭图文案，真人写实摄影，松弛日常感。【场景】现代风格客厅，一整面落地窗引入充足自然光线，白色纱帘过滤成柔和漫射光，窗外是城市天际线或自然景观。【主体】一位25岁亚洲年轻男性，五官精致皮肤干净，黑色短发，上身上衣下身裤子完整穿搭。【姿态表情】对着落地窗站立的日常松弛姿态，表情放松，眼神自然，插兜或抱臂的随意日常感。【光影】落地窗引入的柔和漫射自然光，无强烈阴影，干净通透。【画质】8K超高清，清晰呈现纱帘纹理和窗外景观，干净通透自然无AI感。",
    video: "A handsome Asian man standing by a floor-to-ceiling window in a modern living room, relaxed natural pose, soft diffused natural light, white sheer curtains, looking out the window with a calm expression. Minimal movement, candid home style."
  },
  4: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，对标小红书爆款穿搭图风格，真人写实摄影，松弛江景日常感。【场景】城市高层露台，远景是夕阳下的江河水面，波光粼粼，中景是江岸城市天际线，浅景深突出人物。【主体】一位25岁亚洲年轻男性，五官精致皮肤干净，黑色短发，上身上衣下身裤子完整穿搭。【姿态表情】露台边缘松弛站立，插兜或抱臂，遥望江景，眼神放松，松弛日常感。【时间】傍晚17:30黄金时段，夕阳暖调斜阳，江面金色反光。【画质】8K超高清，傍晚暖调电影感，夕阳人像，松弛江景氛围感，清晰通透无AI感。",
    video: "A handsome Asian man standing on a riverside balcony at golden hour, looking out over the water with a relaxed expression. Golden sunset light on the river behind him, city skyline in the distance, warm cinematic tones. Minimal movement, serene vibe."
  },
  5: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，高级影棚风格，对标顶级时尚杂志封面，真人写实摄影。【场景】专业影棚，简洁纯色背景（如浅灰或黑色），电影级灯光布置。【主体】一位25岁亚洲年轻男性，五官精致棱角分明，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭。【姿态表情】专业模特站姿，肩膀放松舒展，眼神坚定或漫不经心的酷感，嘴角微微上扬或面无表情，高级感。【光影】影棚专业灯光，主光+补光+轮廓光，光影分明，质感强烈，无强烈阴影，完美光比。【画质】8K超高清，哈苏中画幅质感，清晰呈现面料的纹理和层次，影棚级纯净画质，顶级时尚杂志封面水准。",
    video: "A handsome Asian man in a professional studio setting, standing with confident model pose, studio lighting creating sharp highlights and shadows, fashion magazine cover quality, cool minimalist backdrop, luxurious fabric texture visible. Minimal movement, commanding presence."
  },
  6: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，摩纳哥地中海悬崖顶度假别墅场景，老钱风quiet luxury，对标顶级度假宣传片。【场景】地中海悬崖顶度假别墅，白色石材露台，蔚蓝地中海海景，希腊式拱门和仙人掌，强烈的南法度假氛围。【主体】一位25岁亚洲年轻男性，五官精致，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，老钱风。【姿态表情】露台边缘松弛站立，插兜或抱臂，眺望地中海，表情放松自信，松弛矜贵。【时间】午后16点，地中海强烈阳光，蔚蓝海水和白色建筑形成强烈对比。【画质】8K超高清，地中海度假氛围感，老钱风quiet luxury，清晰通透无AI感。",
    video: "A handsome Asian man standing on a Mediterranean cliff-top villa terrace, overlooking the azure sea, relaxed and confident posture, afternoon Mediterranean sunlight, white stone architecture, Greek arches and cacti in background. Quiet luxury resort aesthetic, minimal movement, serene opulence."
  },
  7: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，迪拜滨海游艇码头场景，老钱风松弛贵气，对标高端旅游杂志。【场景】迪拜游艇码头，超级游艇停泊在码头边，海水湛蓝，远景是迪拜天际线（帆船酒店和哈利法塔），高端奢华氛围。【主体】一位25岁亚洲年轻男性，五官精致，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，老钱风。【姿态表情】游艇甲板上松弛站立，插兜或抱臂，眺望码头和海景，表情放松自信，松弛贵气。【时间】傍晚17点，迪拜黄金时段阳光，水面有金色反光。【画质】8K超高清，迪拜老钱风松弛贵气氛围，清晰通透无AI感。",
    video: "A handsome Asian man standing on a yacht deck in Dubai marina, relaxed confident posture, looking out at superyachts and the Dubai skyline (Burj Al Arab and Burj Khalifa in distance), golden hour sunlight reflecting off the water. Quiet luxury, minimal movement, opulent lifestyle aesthetic."
  },
  8: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，欧洲顶级私人高尔夫球场场景，贵族矜贵老钱风，对标高端生活方式杂志。【场景】欧洲私人高尔夫球场，修剪整齐的球道，茂密树木背景，远处会所建筑，宁静私密。【主体】一位25岁亚洲年轻男性，五官精致，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，贵族矜贵。【姿态表情】球场边缘松弛站立，插兜或抱臂，远眺球道，表情放松，绅士矜贵。【时间】上午10点，欧洲柔和阳光，树影斑驳。【画质】8K超高清，欧洲贵族矜贵氛围，清晰通透无AI感。",
    video: "A handsome Asian man standing on a prestigious European private golf course, relaxed refined posture, perfectly manicured fairways and lush trees in background, morning soft sunlight casting gentle shadows. Quiet luxury, country club elegance, minimal movement, distinguished gentleman aesthetic."
  },
  9: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，欧洲科莫湖私人湖泊码头场景，成熟贵气老钱风，对标高端生活方式杂志。【场景】科莫湖私人码头，木质栈桥延伸入湖，水面如镜，倒映周围山丘和别墅，远景是阿尔卑斯山。【主体】一位25岁亚洲年轻男性，五官精致，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，成熟贵气。【姿态表情】码头尽头松弛站立，插兜或抱臂，眺望湖景和山丘，表情放松，贵气内敛。【时间】上午9点，欧洲湖泊清晨柔和光线。【画质】8K超高清，科莫湖成熟贵气氛围，清晰通透无AI感。",
    video: "A handsome Asian man standing at the end of a private wooden dock on Lake Como, Europe, relaxed refined posture, lake water like a mirror reflecting surrounding hills and villas, Alps in distance. Mature luxury aesthetic, morning soft light, minimal movement, distinguished quiet elegance."
  },
  10: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，巴黎左岸咖啡馆门口场景，法式松弛慵懒时髦，对标小红书时尚穿搭博主。【场景】巴黎左岸咖啡馆门口，石板路街道，巴黎铁塔远处背景，露天咖啡座，典型巴黎氛围。【主体】一位25岁亚洲年轻男性，五官精致，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，法式松弛。【姿态表情】咖啡馆门口松弛站立或靠在椅背，插兜或拿咖啡，表情放松，慵懒时髦。【时间】下午15点，巴黎柔和阳光。【画质】8K超高清，巴黎法式松弛慵懒时髦氛围，清晰通透无AI感。",
    video: "A handsome Asian man standing outside a Left Bank Parisian café, relaxed fashionable posture, Haussmann architecture and Eiffel Tower in distance, afternoon soft Parisian sunlight, stone pavement, outdoor café terrace. French casual chic aesthetic, minimal movement, effortlessly stylish vibe."
  },
  11: {
    image: "（画面比例：9:16竖屏构图），极致超清画质，老钱风影棚，哈苏中画幅相机拍摄，极简暖调高级影棚，对标顶奢品牌广告。【场景】极简暖调高级影棚，浅米色或浅灰色无缝背景，柔和但有方向性的灯光，影棚有质感但不抢眼。【主体】一位25岁亚洲年轻男性，五官精致，干净皮肤，黑色短发，上身上衣下身裤子完整穿搭，老钱风。【姿态表情】专业模特站姿，肩膀放松舒展，眼神漫不经心的酷感，高级感。【光影】哈苏中画幅专业灯光，光影柔和但分明，质感强烈，顶级品牌广告水准。【画质】8K超高清，哈苏中画幅质感，16K分辨率，清晰呈现面料的纹理和层次，极简影棚纯净背景，顶级品牌广告水准。",
    video: "A handsome Asian man in a minimalist warm-toned photo studio, professional model standing pose, soft directional studio lighting, cream seamless backdrop, Hasselblad medium format quality, luxury brand advertising aesthetic. Minimal movement, quiet luxury high fashion vibe."
  },
};

/* ── Pill ── */
function Pill({ tone, label }: { tone: string; label: string }) {
  const colors: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    slate: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[tone] || colors.slate}`}>{label}</span>;
}

/* ── Page ── */
export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ── Image generation state ──
  const [refImages, setRefImages] = useState<{ url: string; localUrl: string }[]>([]); // uploaded images
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState<string | null>(null);
  const [imageResults, setImageResults] = useState<{ url: string; videoUrl?: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Spec state ──
  const [specOpen, setSpecOpen] = useState(false);
  const [spec, setSpec] = useState({ resolution: "720p", duration: "10s", language: "英语", ratio: "9:16" });
  const [role, setRole] = useState("智能生成");

  // ── Filter state ──
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const TRENDING: TrendingItem[] = [
    { id:1, title:"夏季轻奢T恤穿搭", thumb:"https://picsum.photos/seed/t1/400/600", views:"12.8万", likes:"3.2k", country:"🇺🇸 美国", category:"男装与男士内衣", videoType:"穿搭变装" },
    { id:2, title:"商务衬衫一周搭配", thumb:"https://picsum.photos/seed/t2/400/600", views:"8.5万", likes:"2.1k", country:"🇬🇧 英国", category:"男装与男士内衣", videoType:"多品横向对比" },
    { id:3, title:"运动风卫衣3色对比", thumb:"https://picsum.photos/seed/t3/400/600", views:"15.2万", likes:"4.5k", country:"🇺🇸 美国", category:"运动与户外", videoType:"第一人称开箱" },
    { id:4, title:"秋冬大衣面料测评", thumb:"https://picsum.photos/seed/t4/400/600", views:"6.3万", likes:"1.8k", country:"🇫🇷 法国", category:"男装与男士内衣", videoType:"产品镜头特写" },
    { id:5, title:"牛仔外套复古氛围感", thumb:"https://picsum.photos/seed/t5/400/600", views:"9.1万", likes:"2.7k", country:"🇩🇪 德国", category:"时尚配件", videoType:"ASMR感官沉浸" },
    { id:6, title:"POLO衫职场轻商务", thumb:"https://picsum.photos/seed/t6/400/600", views:"7.4万", likes:"1.9k", country:"🇺🇸 美国", category:"男装与男士内衣", videoType:"品牌短TVC" },
    { id:7, title:"夏季短裤搭配灵感", thumb:"https://picsum.photos/seed/t7/400/600", views:"11.2万", likes:"3.6k", country:"🇹🇭 泰国", category:"男装与男士内衣", videoType:"穿搭变装" },
    { id:8, title:"西装外套轻商务风", thumb:"https://picsum.photos/seed/t8/400/600", views:"5.8万", likes:"1.4k", country:"🇬🇧 英国", category:"男装与男士内衣", videoType:"促销卖点强推" },
    { id:9, title:"卫衣套装运动休闲", thumb:"https://picsum.photos/seed/t9/400/600", views:"4.1万", likes:"1.1k", country:"🇲🇾 马来西亚", category:"运动与户外", videoType:"互动剧情演绎" },
    { id:10, title:"羽绒服保暖实测", thumb:"https://picsum.photos/seed/t10/400/600", views:"3.6万", likes:"980", country:"🇻🇳 越南", category:"男装与男士内衣", videoType:"第一人称开箱" },
  ];

  const COUNTRIES = ["🇺🇸 美国","🇬🇧 英国","🇫🇷 法国","🇩🇪 德国","🇲🇾 马来西亚","🇹🇭 泰国","🇻🇳 越南"];
  const CATEGORIES = ["女装与女士内衣","美妆个护","运动与户外","男装与男士内衣","保健","手机与数码","时尚配件","食品饮料","居家日用"];
  const VIDEO_TYPES = ["真实使用测评","口播介绍","手持商品展示","OOTD穿搭展示","场景化生活秀","第一人称开箱","促销卖点强推","互动剧情演绎","产品镜头特写","ASMR感官沉浸","品牌短TVC","多品横向对比","穿搭变装"];
  const RESOLUTIONS = ["720p","1080p","2K"];
  const DURATIONS = ["6s","10s","12s","15s","30s"];
  const LANGUAGES = ["英语","中文","日语","韩语","西班牙语","法语"];
  const RATIOS = ["9:16","16:9","1:1","4:3"];
  const ROLES = ["智能生成","专业带货","生活场景","品牌故事","ASMR风格"];

  const visibleCountries = showAllCountries ? COUNTRIES : COUNTRIES.slice(0, 5);
  const visibleCategories = showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 5);
  const visibleTypes = showAllTypes ? VIDEO_TYPES : VIDEO_TYPES.slice(0, 5);

  const filteredTrending = TRENDING.filter(v =>
    (!countryFilter || v.country === countryFilter) &&
    (!categoryFilter || v.category === categoryFilter) &&
    (!typeFilter || v.videoType === typeFilter)
  );

  /* ── Upload image to ToAPIs ── */
  const uploadToToAPIs = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("https://toapis.com/v1/uploads/images", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TOAPIS_API_KEY || "sk-SMP...1ztY"}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.url; // public URL from ToAPIs
  };

  /* ── Handle file select (up to 5) ── */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (refImages.length + files.length > 5) {
      setError(`最多5张图，当前已选${refImages.length}张`);
      return;
    }
    setError(null);
    const newImages: { url: string; localUrl: string }[] = [];
    for (const file of files) {
      try {
        const url = await uploadToToAPIs(file);
        newImages.push({ url, localUrl: URL.createObjectURL(file) });
      } catch (err) {
        setError(`上传失败: ${err}`);
      }
    }
    setRefImages(prev => [...prev, ...newImages]);
    e.target.value = "";
  };

  /* ── Remove ref image ── */
  const removeRefImage = (idx: number) => {
    setRefImages(prev => prev.filter((_, i) => i !== idx));
  };

  /* ── Generate image ── */
  const handleGenerate = async () => {
    if (refImages.length === 0) { setError("请先上传参考图"); return; }
    if (!selectedStyle) { setError("请选择一个风格"); return; }
    setError(null);
    setGenerating(true);
    try {
      const stylePrompt = STYLE_PROMPTS[selectedStyle];
      const refUrls = refImages.map(img => img.url);

      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: stylePrompt.image,
          reference_images: refUrls,
          size: "576x1024",
          n: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data));

      // result.data[0].url
      const resultUrl = data.data?.[0]?.url || data.url;
      if (!resultUrl) throw new Error("No image URL in response");

      setImageResults(prev => [{ url: resultUrl }, ...prev]);
      setSelectedStyle(null); // reset
    } catch (err: unknown) {
      setError(`生成失败: ${(err instanceof Error ? err.message : String(err))}`);
    }
    setGenerating(false);
  };

  /* ── Generate video ── */
  const handleGenerateVideo = async (imageUrl: string, idx: number) => {
    setGeneratingVideo(imageUrl);
    try {
      const stylePrompt = selectedStyle ? STYLE_PROMPTS[selectedStyle]?.video : "A handsome Asian man, fashion photography, high quality video.";
      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "doubao-seedance-1-0-pro-quality",
          prompt: stylePrompt,
          image_urls: [imageUrl],
          duration: 5,
          aspect_ratio: "9:16",
          resolution: "720p",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video generation failed");

      // Poll for result
      const taskId = data.id || data.task_id;
      if (taskId) {
        let attempts = 0;
        while (attempts < 60) {
          await new Promise(r => setTimeout(r, 5000));
          const statusRes = await fetch(`/api/ai/video/${taskId}`);
          const statusData = await statusRes.json();
          if (statusData.status === "completed" || statusData.status === "success") {
            const videoUrl = statusData.url || statusData.video_url;
            if (videoUrl) {
              setImageResults(prev => prev.map((img, i) => i === idx ? { ...img, videoUrl } : img));
            }
            break;
          }
          if (statusData.status === "failed") throw new Error("Video generation failed");
          attempts++;
        }
      }
    } catch (err: unknown) {
      setError(`视频生成失败: ${(err instanceof Error ? err.message : String(err))}`);
    }
    setGeneratingVideo(null);
  };

  const fetchTasks = useCallback(() => {
    return fetch(`${API}/tasks?limit=6`, { cache: "no-store" })
      .then(res => res.json())
      .then(json => {
        setTasks(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []);
      })
      .catch(() => {});
  }, []);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50">
      {/* ═══ Header ═══ */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-bold text-gray-900 no-underline">S SUPERCOLOR</Link>
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "视频营销Agent", href: "/" },
                { label: "爆款社区", href: "/" },
                { label: "AI工具", href: "/ai-tools" },
                { label: "我的资产", href: "/" },
                { label: "我的角色", href: "/" },
                { label: "全部任务", href: "/tasks" },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  className="px-3 py-1.5 text-[13px] text-gray-500 hover:text-gray-900 no-underline rounded-lg hover:bg-gray-100 transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 no-underline">使用文档</a>
            <button className="px-3 py-1 text-[12px] border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-transparent">ZH</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        {/* ═══ 上传图片区域 ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="plus-image" size={18} />
            <h2 className="text-[15px] font-semibold text-gray-900 m-0">上传参考图（最多5张）</h2>
            <span className="text-[12px] text-gray-400 ml-auto">支持上衣、裤子、细节图等</span>
          </div>

          {/* Thumbnails */}
          {refImages.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {refImages.map((img, i) => (
                <div key={i} className="relative group w-20 h-20 shrink-0">
                  <img src={img.localUrl} alt={`参考图${i+1}`} className="w-full h-full object-cover rounded-xl border border-gray-200" />
                  <button onClick={() => removeRefImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">#{i+1}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add more button */}
          {refImages.length < 5 && (
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-[13px] text-gray-400 hover:border-cyan-400 hover:text-cyan-600 transition-colors cursor-pointer bg-transparent">
              <Icon name="upload" size={14} />
              添加图片 {refImages.length > 0 && `(${refImages.length}/5)`}
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

          {error && (
            <div className="mt-3 px-3 py-2 bg-red-50 text-red-600 text-[12px] rounded-lg border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* ═══ 风格选择（下拉式） ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[13px] text-gray-500 shrink-0">风格：</span>
            <div className="relative">
              <select
                value={selectedStyle || ""}
                onChange={e => setSelectedStyle(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 cursor-pointer focus:outline-none focus:border-cyan-400 min-w-[200px]"
              >
                <option value="">— 选择风格 —</option>
                {STYLES.map(s => (
                  <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
            </div>
            {selectedStyle && (
              <span className="text-[12px] text-cyan-600 bg-cyan-50 px-2 py-1 rounded-lg">
                {STYLES.find(s => s.id === selectedStyle)?.emoji} {STYLES.find(s => s.id === selectedStyle)?.name}
              </span>
            )}
          </div>
        </div>

        {/* ═══ 规格选择 ═══ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Spec selector */}
            <button onClick={() => setSpecOpen(!specOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors border-0 cursor-pointer bg-gray-50">
              <Icon name="settings" size={12} />
              {spec.resolution}/{spec.duration}/{spec.language}/{spec.ratio}
            </button>
            {/* Role selector */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors border-0 cursor-pointer bg-gray-50">
              <Icon name="user" size={12} />
              角色: {role}
            </button>
            {/* Generate button */}
            <button onClick={handleGenerate} disabled={generating || refImages.length === 0 || !selectedStyle}
              className="ml-auto flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-xl text-[13px] font-semibold border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors">
              {generating ? <><Icon name="loader" size={14} />生成中…</> : <><Icon name="wand" size={14} />生成穿搭图</>}
            </button>
          </div>

          {/* Spec dropdown */}
          {specOpen && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] text-gray-500 font-medium mb-2 block">分辨率</label>
                <div className="flex flex-col gap-1">
                  {RESOLUTIONS.map(r => (
                    <button key={r} onClick={() => setSpec(s => ({...s, resolution: r}))}
                      className={`px-3 py-1.5 rounded-lg text-[12px] text-left border-0 cursor-pointer transition-colors ${spec.resolution === r ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-medium mb-2 block">时长</label>
                <div className="flex flex-col gap-1">
                  {DURATIONS.map(d => (
                    <button key={d} onClick={() => setSpec(s => ({...s, duration: d}))}
                      className={`px-3 py-1.5 rounded-lg text-[12px] text-left border-0 cursor-pointer transition-colors ${spec.duration === d ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-medium mb-2 block">语言</label>
                <div className="flex flex-col gap-1">
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => setSpec(s => ({...s, language: l}))}
                      className={`px-3 py-1.5 rounded-lg text-[12px] text-left border-0 cursor-pointer transition-colors ${spec.language === l ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-medium mb-2 block">比例</label>
                <div className="flex flex-col gap-1">
                  {RATIOS.map(r => (
                    <button key={r} onClick={() => setSpec(s => ({...s, ratio: r}))}
                      className={`px-3 py-1.5 rounded-lg text-[12px] text-left border-0 cursor-pointer transition-colors ${spec.ratio === r ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══ 生成结果 ═══ */}
        {imageResults.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
            <h3 className="text-[14px] font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Icon name="image" size={16} />
              生成结果
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imageResults.map((img, i) => (
                <div key={i} className="shrink-0 relative group">
                  <img src={img.url} alt={`结果${i+1}`} className="w-40 h-64 rounded-xl object-cover border border-gray-200" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center gap-2 p-3">
                    <button className="w-full px-3 py-1.5 bg-white text-[11px] font-medium rounded-lg cursor-pointer border-0 flex items-center gap-1 justify-center">
                      <Icon name="upload" size={11} /> 下载
                    </button>
                    <button
                      onClick={() => handleGenerateVideo(img.url, i)}
                      disabled={generatingVideo === img.url}
                      className="w-full px-3 py-1.5 bg-cyan-500 text-white text-[11px] font-medium rounded-lg cursor-pointer border-0 flex items-center gap-1 justify-center disabled:opacity-60">
                      {generatingVideo === img.url ? (
                        <><Icon name="loader" size={11} />生成中…</>
                      ) : (
                        <><Icon name="film" size={11} />生成视频</>
                      )}
                    </button>
                    {img.videoUrl && (
                      <a href={img.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="w-full px-3 py-1.5 bg-green-500 text-white text-[11px] font-medium rounded-lg cursor-pointer border-0 flex items-center gap-1 justify-center no-underline">
                        <Icon name="play" size={11} /> 查看视频
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ 最近创建 ═══ */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-gray-900">最近创建</h2>
            <Link href="/tasks" className="text-[13px] font-medium text-cyan-600 hover:text-cyan-700 no-underline flex items-center gap-1">查看全部 →</Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">暂无创建记录</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 4).map(t => {
                const sc = t.status;
                const tone = sc === "completed" ? "green" : sc === "running" || sc === "external_polling" ? "cyan" : sc === "pending" ? "amber" : sc === "failed" ? "red" : "slate";
                const label: Record<string,string> = { completed:"已完成", running:"运行中", pending:"等待中", failed:"失败", external_polling:"轮询中" };
                return (
                  <Link key={t.id} href={`/tasks/${t.task_id || t.id}`}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm no-underline transition-all">
                    <Pill tone={tone} label={label[sc] || sc} />
                    <span className="flex-1 text-[13px] text-gray-700 truncate font-mono">{t.task_id || t.id}</span>
                    <span className="text-[11px] text-gray-400 font-mono shrink-0">
                      {new Date(t.created_at).toLocaleString("zh-CN", { month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" })}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ═══ 爆款社区 ═══ */}
        <section className="pb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-bold text-gray-900 m-0">爆款社区</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-gray-900 text-white border-0 cursor-pointer">热门爆款趋势</button>
              <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-50">精选案例</button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[12px] text-gray-400 shrink-0">国家：</span>
            {visibleCountries.map(c => (
              <button key={c} onClick={() => setCountryFilter(countryFilter === c ? null : c)}
                className={`px-2.5 py-1 rounded-md text-[12px] transition-all border-0 cursor-pointer ${countryFilter === c ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{c}</button>
            ))}
            {COUNTRIES.length > 5 && (
              <button onClick={() => setShowAllCountries(!showAllCountries)}
                className="text-[12px] text-cyan-600 border-0 bg-transparent cursor-pointer hover:text-cyan-700">{showAllCountries ? "收起" : "展开"}</button>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[12px] text-gray-400 shrink-0">类目：</span>
            {visibleCategories.map(c => (
              <button key={c} onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
                className={`px-2.5 py-1 rounded-md text-[12px] transition-all border-0 cursor-pointer ${categoryFilter === c ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{c}</button>
            ))}
            {CATEGORIES.length > 5 && (
              <button onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-[12px] text-cyan-600 border-0 bg-transparent cursor-pointer hover:text-cyan-700">{showAllCategories ? "收起" : "展开"}</button>
            )}
          </div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-[12px] text-gray-400 shrink-0">视频类型：</span>
            {visibleTypes.map(t => (
              <button key={t} onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={`px-2.5 py-1 rounded-md text-[12px] transition-all border-0 cursor-pointer ${typeFilter === t ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>{t}</button>
            ))}
            {VIDEO_TYPES.length > 5 && (
              <button onClick={() => setShowAllTypes(!showAllTypes)}
                className="text-[12px] text-cyan-600 border-0 bg-transparent cursor-pointer hover:text-cyan-700">{showAllTypes ? "收起" : "展开"}</button>
            )}
          </div>

          {/* Trending grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredTrending.map(v => (
              <div key={v.id} className="group">
                <div className="aspect-[2/3] rounded-xl bg-gray-100 overflow-hidden mb-2 relative">
                  <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Icon name="play" size={9} />{v.views}
                  </div>
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 bg-gray-900/80 backdrop-blur text-white text-[11px] font-medium rounded-lg border-0 cursor-pointer">
                    一键复刻
                  </button>
                </div>
                <p className="text-[13px] font-medium text-gray-900 m-0 truncate">{v.title}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                  <span>{v.country}</span>
                  <span className="flex items-center gap-0.5"><Icon name="eye" size={10} />{v.views}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}