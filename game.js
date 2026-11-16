const $=s=>document.querySelector(s);
const LANG_KEY='bj-lang',SAVE_KEY='bj1',STATS_KEY='bjs',ACH_KEY='bja';
const TEXT={
 vi:{
  'Language':'Ngôn ngữ','English':'Tiếng Anh','Vietnamese':'Tiếng Việt','Save error':'Không thể lưu ván chơi trên trình duyệt.','Save unavailable':'Bộ nhớ trình duyệt không khả dụng.','Save corrupted':'Dữ liệu ván lưu bị hỏng hoặc không tương thích.','Save restored':'Đã khôi phục ván chơi.','Saved game':'Tiếp tục ván đã lưu','Deck':'Chọn bộ bài','Guide':'Hướng dẫn & bảng điểm','Jokers':'Danh sách Joker','Sound on':'Bật âm thanh','Sound off':'Tắt âm thanh','Target score':'Điểm mục tiêu','Current score':'Điểm hiện tại','Hands':'Lượt đánh','Discards':'Lượt xả','Money':'Tiền','Ante':'Ante','Small Blind':'Vòng nhỏ','Big Blind':'Vòng lớn','Boss Blind':'Trùm','Choose':'Chọn','Start':'Bắt đầu','Skip':'Bỏ qua','Skip (get Tag)':'Bỏ qua (nhận Tag)','Play':'Đánh bài','Discard':'Xả bài','Sort by rank':'Xếp theo số','Sort by suit':'Xếp theo chất','Cards left':'Bộ bài còn','Round won':'Qua vòng!','Shop':'Cửa hàng','Next round':'Vòng tiếp theo','Reroll':'Làm mới','Free':'MIỄN PHÍ','Buy':'Mua','Sell':'Bán','Play again':'Chơi lại','You win':'Bạn thắng! 🎉','You lose':'Thua rồi','Play endless':'Chơi vô hạn','Close':'Đóng','Next':'Tiếp','Back':'Quay lại','Skip guide':'Bỏ qua','Achievements':'Thành tựu','Common':'Thường','Uncommon':'Không thường','Rare':'Hiếm','Legendary':'Huyền thoại','No Jokers':'Chưa có Joker','Select up to':'Chọn tối đa','level':'cấp','Reward':'Thưởng','Reach':'Đạt','Pack':'Gói','Pick':'Chọn','Open pack':'Mở gói','Cash reward':'Thưởng vòng','Remaining hands':'Lượt đánh còn lại','Interest':'Lãi','Bonus gold':'Vàng thưởng','End of round Jokers':'Joker cuối vòng','Total':'Tổng','Language saved':'Ngôn ngữ đã được lưu','Played':'Đã chơi','Wins':'thắng','Highest ante':'ante cao nhất','Stake rules':'Luật Stake','You cleared the run':'Bạn đã vượt qua cả 8 ante.','Stopped at':'Dừng ở','Boss hands left':'Còn 3 lượt đánh'
 },
 en:{
  'Language':'Language','English':'English','Vietnamese':'Vietnamese','Save error':'Unable to save the run in browser storage.','Save unavailable':'Browser storage is unavailable.','Save corrupted':'The saved run is corrupted or incompatible.','Save restored':'Run restored.','Saved game':'Resume saved run','Deck':'Choose a deck','Guide':'Guide & scoring','Jokers':'Joker list','Sound on':'Enable sound','Sound off':'Disable sound','Target score':'Target score','Current score':'Current score','Hands':'Hands','Discards':'Discards','Money':'Money','Ante':'Ante','Small Blind':'Small Blind','Big Blind':'Big Blind','Boss Blind':'Boss','Vòng nhỏ':'Small Blind','Vòng lớn':'Big Blind','Trùm':'Boss','Choose':'Choose','Start':'Start','Skip':'Skip','Skip (get Tag)':'Skip (get Tag)','Play':'Play hand','Discard':'Discard','Sort by rank':'Sort by rank','Sort by suit':'Sort by suit','Cards left':'Cards left','Round won':'Round won!','Shop':'Shop','Next round':'Next round','Reroll':'Reroll','Free':'FREE','Buy':'Buy','Sell':'Sell','Play again':'Play again','You win':'You win! 🎉','You lose':'You lose','Play endless':'Play endless','Close':'Close','Next':'Next','Back':'Back','Skip guide':'Skip','Achievements':'Achievements','Common':'Common','Uncommon':'Uncommon','Rare':'Rare','Legendary':'Legendary','No Jokers':'No Jokers','Select up to':'Select up to','level':'level','Reward':'Reward','Reach':'Reach','Pack':'Pack','Pick':'Pick','Open pack':'Open pack','Cash reward':'Round reward','Remaining hands':'Remaining hands','Interest':'Interest','Bonus gold':'Bonus gold','End of round Jokers':'End-of-round Jokers','Total':'Total','Language saved':'Language saved','Played':'Played','Wins':'wins','Highest ante':'highest ante','Stake rules':'Stake rules','You cleared the run':'You cleared all 8 antes.','Stopped at':'Stopped at','Boss hands left':'3 hands left'
 }
};
let currentLang='vi',G;
function tr(key){return TEXT[currentLang][key]||key}
function setLanguage(next,savePreference=true){currentLang=next==='en'?'en':'vi';document.documentElement.lang=currentLang;document.documentElement.dataset.lang=currentLang;if(savePreference){try{localStorage.setItem(LANG_KEY,currentLang);const raw=localStorage.getItem(SAVE_KEY);if(raw){const saved=JSON.parse(raw);saved.lang=currentLang;localStorage.setItem(SAVE_KEY,JSON.stringify(saved))}}catch(e){if(typeof storageError==='function')storageError(tr('Save error'))}}if(typeof G!=='undefined'&&G){G.lang=currentLang;G.msg=tr('Language saved')}if(typeof render==='function'&&typeof G!=='undefined'&&G){render();if($('#modal').innerHTML)help(0)}}
function initLanguage(){let stored='vi';try{stored=localStorage.getItem(LANG_KEY)||'vi'}catch(e){}setLanguage(stored,false)}
async function loadTranslations(){try{const response=await fetch('i18n.json',{cache:'no-store'});if(!response.ok)throw Error('translation request failed');const data=await response.json();Object.assign(TEXT.vi,data.vi||{});Object.assign(TEXT.en,data.en||{})}catch(e){console.warn('Using built-in translations because i18n.json could not be loaded.',e)}}
const SU=['♠','♥','♦','♣'],RN={11:'J',12:'Q',13:'K',14:'A'};
const HT={sf:['Sảnh thùng',100,8,40,4],flh:['Thùng cù lũ',140,12,50,5],five:['Năm lá',120,12,50,5],f4:['Tứ quý',60,7,30,3],fh:['Cù lũ',40,4,25,2],fl:['Thùng',35,4,15,2],st:['Sảnh',30,4,30,3],t3:['Sám cô',30,3,20,2],p2:['Hai đôi',20,2,20,1],p1:['Đôi',10,2,15,1],hc:['Bài cao',5,1,10,1]};
const HAND_KEYS=Object.keys(HT);
const TARGET=[300,800,2000,5000,11000,20000,35000,50000];
const BL=[{n:'Vòng nhỏ',k:1,r:3,c:'small'},{n:'Vòng lớn',k:1.5,r:4,c:'big'},{n:'Trùm',k:2,r:5,c:'boss'}];
const cv=r=>r==14?11:r>10?10:r;
const RARITY={common:'Thường',uncommon:'Không thường',rare:'Hiếm',legendary:'Huyền thoại'};
const RARITY_EN={common:'Common',uncommon:'Uncommon',rare:'Rare',legendary:'Legendary'};
const rarityLabel=r=>currentLang=='en'?RARITY_EN[r]:RARITY[r];
const J=[
{n:'Joker',cost:2,d:'+4 Mult',hand:x=>[0,4]},
{n:'Tham lam',cost:5,d:'Lá ♦ ghi điểm: +3 Mult',card:(c)=>c.s==2?[0,3]:0},
{n:'Dục vọng',cost:5,d:'Lá ♥ ghi điểm: +3 Mult',card:c=>c.s==1?[0,3]:0},
{n:'Giận dữ',cost:5,d:'Lá ♠ ghi điểm: +3 Mult',card:c=>c.s==0?[0,3]:0},
{n:'Háu ăn',cost:5,d:'Lá ♣ ghi điểm: +3 Mult',card:c=>c.s==3?[0,3]:0},
{n:'Vui nhộn',cost:3,d:'+8 Mult nếu có Đôi',hand:x=>x.pair?[0,8]:0},
{n:'Điên rồ',cost:4,d:'+12 Mult nếu có Sám cô',hand:x=>x.tri?[0,12]:0},
{n:'Láu cá',cost:3,d:'+50 Chips nếu có Đôi',hand:x=>x.pair?[50,0]:0},
{n:'Tối giản',cost:5,d:'+20 Mult nếu đánh ≤3 lá',hand:x=>x.n<=3?[0,20]:0},
{n:'Biểu ngữ',cost:5,d:'+30 Chips mỗi lượt xả còn lại',hand:x=>[30*x.disc,0]},
{n:'Trừu tượng',cost:4,d:'+3 Mult mỗi Joker đang có',hand:x=>[0,3*x.jn]},
{n:'Học giả',cost:4,d:'Át ghi điểm: +20 Chips, +4 Mult',card:c=>c.r==14?[20,4]:0},
{n:'Chẵn Steven',cost:4,d:'Lá chẵn ghi điểm: +4 Mult',card:c=>c.r<=10&&c.r%2==0?[0,4]:0},
{n:'Lẻ Todd',cost:4,d:'Lá lẻ ghi điểm: +31 Chips',card:c=>(c.r==14||(c.r<=9&&c.r%2==1))?[31,0]:0},
{n:'Song sinh',cost:8,d:'×2 Mult nếu có Đôi',hand:x=>x.pair?[0,0,2]:0},
{n:'Mặt người',cost:4,d:'J, Q, K ghi điểm: +3 Mult',card:c=>c.r>=11&&c.r<=13?[0,3]:0},
{n:'Bò mộng',cost:6,d:'+2 Chips cho mỗi $ đang có',hand:x=>[2*Math.max(0,x.money),0]},
{n:'Vàng ròng',cost:6,d:'+$2 cuối mỗi vòng',gold:2},
{n:'Cú chót',cost:5,d:'+25 Mult ở lượt đánh cuối',hand:x=>x.last?[0,25]:0},
{n:'Cô đơn',cost:6,d:'×3 Mult nếu chỉ có Bài cao',hand:x=>x.t=='hc'?[0,0,3]:0},
{n:'Sảnh thủ',cost:5,d:'+100 Chips nếu là Sảnh',hand:x=>x.t=='st'||x.t=='sf'?[100,0]:0},
{n:'Thùng thủ',cost:5,d:'+80 Chips nếu là Thùng',hand:x=>x.t=='fl'||x.t=='sf'?[80,0]:0},
{n:'Hai đôi',cost:4,d:'+10 Mult nếu là Hai đôi',hand:x=>x.t=='p2'?[0,10]:0},
{n:'Đại gia',cost:7,d:'×1.5 Mult nếu có từ $20',hand:x=>x.money>=20?[0,0,1.5]:0},
{n:'Đen đỏ',cost:4,d:'Lá ♠ và ♣ ghi điểm: +2 Mult',card:c=>c.s==0||c.s==3?[0,2]:0},
{n:'Cù lũ vàng',cost:6,d:'×3 Mult nếu là Cù lũ',hand:x=>x.t=='fh'?[0,0,3]:0},
{n:'Cuộn tuyết',cost:6,d:'Mỗi lần đánh tích thêm +2 Mult',hand:(x,j)=>[0,2*(j.v||0)],grow:1},
{n:'Bậc thầy',cost:10,d:'×1.5 Mult luôn luôn',hand:x=>[0,0,1.5]},
{n:'Ma thuật',cost:9,d:'×2 Mult nếu đánh đúng 5 lá',hand:x=>x.n==5?[0,0,2]:0},
{n:'Nhà thầu rác',cost:6,d:'Nhận $1 mỗi lần xả bài',dm:1},
{n:'Túi lớn',cost:7,d:'+1 cỡ tay (tính từ vòng sau)',hsz:1},
{n:'Đồng hồ cát',cost:8,d:'+1 lượt đánh mỗi vòng (tính từ vòng sau)',hh:1},
{n:'Bản sao',cost:10,d:'Sao chép hiệu ứng Joker bên phải (loại theo tổ hợp)',hand:(x,j)=>{const R=G.jokers[G.jokers.indexOf(j)+1];return R&&R.hand&&!R.copy?R.hand(x,R):0},copy:1},
{n:'Bốn ngón',cost:7,d:'Sảnh và Thùng chỉ cần 4 lá',four:1},
{n:'Đường tắt',cost:6,d:'Sảnh được phép nhảy cách 1 bậc (vd 3-5-6-7-9)',gap:1},
{n:'Hoàng gia',cost:8,d:'×2 Mult nếu là Thùng',hand:x=>x.t=='fl'||x.t=='sf'?[0,0,2]:0},
{n:'Tứ vị',cost:8,d:'×3 Mult nếu có Tứ quý',hand:x=>x.t=='f4'?[0,0,3]:0},
{n:'Cực đoan',cost:6,d:'+15 Mult nếu đánh 1 lá',hand:x=>x.n==1?[0,15]:0},
{n:'Gấp đôi',cost:5,d:'+12 Mult nếu là Hai đôi hoặc Cù lũ',hand:x=>x.t=='p2'||x.t=='fh'?[0,12]:0},
{n:'Mặt đỏ',cost:4,d:'Lá ♥ và ♦ ghi điểm: +2 Mult',card:c=>c.s==1||c.s==2?[0,2]:0},
{n:'Kẻ tiết kiệm',cost:6,d:'+1 Mult mỗi $3 đang có',hand:x=>[0,Math.floor(x.money/3)]},
{n:'Ván cuối',cost:6,d:'+100 Chips ở lượt đánh cuối',hand:x=>x.last?[100,0]:0},
{n:'Phú ông',cost:9,d:'×2 Mult nếu có từ $30',hand:x=>x.money>=30?[0,0,2]:0},
{n:'Cốt lõi',cost:5,d:'Lá 2–5 ghi điểm: +10 Chips, +3 Mult',card:c=>c.r<=5?[10,3]:0},
{n:'Cái ấm',cost:6,d:'+2 Mult mỗi lượt xả còn lại',hand:x=>[0,2*x.disc]},
{n:'Người giữ',cost:6,d:'Mỗi lá giữ trên tay: +3 Chips',held:c=>[3,0]},
{n:'Thùng rác',cost:5,d:'Mỗi lần xả: +3 Mult',discard:x=>[0,3]},
{n:'Máy đếm',cost:7,d:'Mỗi lần đánh tay: +1 Mult tích lũy',hand:(x,j)=>[0,j.v||0],grow:1,gs:j=>'đang +'+(j.v||0)},
{n:'Nhà sưu tầm',cost:8,d:'Cuối vòng: +$1 cho mỗi Joker',end:x=>x.jn},
{n:'Kẻ liều lĩnh',cost:6,d:'×2 Mult nếu còn đúng 1 lượt đánh',hand:x=>x.last?[0,0,2]:0},
{n:'Mắt cú',cost:5,d:'+20 Chips nếu hand có 4 chất khác nhau',hand:x=>x.suits==4?[20,0]:0}
,{n:'Bánh răng',cost:7,d:'Lá đầu tiên ghi điểm được kích hoạt lại',repeat:1}
,{n:'Cầu vồng',cost:8,d:'Mỗi chất khác nhau trong hand: +4 Mult',hand:x=>[0,4*x.suits]}
,{n:'Bộ sưu tập',cost:7,d:'Mỗi lá có Enhancement khác nhau: +8 Mult',hand:x=>[0,8*x.enh]}
,{n:'Đá quý',cost:6,d:'Lá Stone ghi điểm: +25 Chips',card:c=>c.enh=='stone'?[25,0]:0}
,{n:'Dấu ấn đỏ',cost:7,d:'Lá có Seal ghi điểm: +5 Mult',card:c=>c.seal?[0,5]:0}
,{n:'Kẻ săn tiền',cost:5,d:'+$1 cuối vòng',end:1}
,{n:'Nhà giả kim',cost:8,d:'Nếu hand có Wild và Stone: ×2 Mult',hand:x=>x.wild&&x.stone?[0,0,2]:0},{n:'Hack',cost:6,d:'Lá 2–5 ghi điểm được kích hoạt lại',rep:c=>c.r<=5&&c.enh!='stone'?1:0}
,{n:'Hoàng thân',cost:8,d:'J, Q, K ghi điểm được kích hoạt lại',rep:c=>c.r>=11&&c.r<=13?1:0}
,{n:'Người gác',cost:7,d:'Lá giữ trên tay được kích hoạt lại',repHeld:c=>1}
,{n:'Nặng tay',cost:5,d:'Mỗi lá giữ trên tay: +2 Mult',held:c=>[0,2]}
,{n:'Nữ hoàng giữ',cost:8,d:'Lá Q giữ trên tay: ×1.5 Mult',held:c=>c.r==12?[0,0,1.5]:0}
,{n:'Thợ rèn',cost:5,d:'Lá Steel giữ trên tay: +10 Chips',held:c=>c.enh=='steel'?[10,0]:0}
,{n:'Sảnh vàng',cost:8,d:'×3 Mult nếu là Sảnh',hand:x=>x.t=='st'||x.t=='sf'?[0,0,3]:0}
,{n:'Tam sắc',cost:5,d:'+3 Mult cho mỗi lá ghi điểm',hand:x=>[0,3*x.scored]}
,{n:'Chip cầm tay',cost:4,d:'+10 Chips cho mỗi lá ghi điểm',hand:x=>[10*x.scored,0]}
,{n:'Phù thủy',cost:5,d:'Lá Wild ghi điểm: +3 Mult',card:c=>c.enh=='wild'?[0,3]:0}
,{n:'Kính lúp',cost:5,d:'Lá Glass ghi điểm: +20 Chips',card:c=>c.enh=='glass'?[20,0]:0}
,{n:'Lá may',cost:5,d:'Lá Lucky ghi điểm: +4 Mult',card:c=>c.enh=='lucky'?[0,4]:0}
,{n:'Nhịp tim',cost:5,d:'+3 Mult cho mỗi lượt đánh còn lại',hand:x=>[0,3*x.hands]}
,{n:'Kẻ tích lũy',cost:8,d:'Mỗi lần đánh tay tích thêm ×0.25 Mult (bắt đầu ×1)',hand:(x,j)=>[0,0,1+.25*(j.v||0)],grow:1,gs:j=>'đang ×'+(1+.25*(j.v||0))}
,{n:'Quỹ đen',cost:6,d:'Cuối vòng: +$1 cho mỗi $10 đang có (tối đa +$5)',end:x=>Math.min(5,Math.floor(x.money/10))}
,{n:'Đôi tay',cost:6,d:'+4 Mult nếu có Đôi, thêm +4 nếu có Sám cô',hand:x=>x.pair?[0,4+(x.tri?4:0)]:0}
];
const JL=[{n:'Thần bài',cost:20,rarity:'legendary',d:'×3 Mult luôn luôn',hand:x=>[0,0,3]},{n:'Bậc tiền bối',cost:20,rarity:'legendary',d:'Lá J, Q, K ghi điểm: ×1.5 Mult',card:c=>c.r>=11&&c.r<=13?[0,0,1.5]:0},{n:'Thợ kim hoàn',cost:20,rarity:'legendary',d:'+$4 cuối mỗi vòng và +30 Mult',hand:x=>[0,30],gold:4}];
const ALL_JOKERS=J.concat(JL);
const DECKS=[{n:'Bộ lớn',d:'+1 cỡ tay, −1 lượt xả',hs:1,disc:-1},{n:'Bộ nhị sắc',d:'Chỉ có lá ♠ và ♥ (26 lá)',suits:[0,1]},{n:'Bộ đỏ',d:'+1 lượt xả',disc:1},{n:'Bộ xanh',d:'+1 lượt đánh',hands:1},{n:'Bộ đen',d:'+1 ô Joker, −1 lượt đánh',slots:1,hands:-1},{n:'Bộ vàng',d:'Bắt đầu với $10',money:6},{n:'Bộ cân bằng',d:'+1 lượt đánh, +1 lượt xả, −1 cỡ tay',hands:1,disc:1,hs:-1},{n:'Bộ tiết kiệm',d:'Bắt đầu với $14, −1 lượt đánh',money:10,hands:-1},{n:'Bộ trống mặt',d:'Bỏ J, Q, K (40 lá), +1 ô consumable',noFace:1,cons:1},{n:'Bộ lão luyện',d:'Bắt đầu với Cù lũ và Sảnh cấp 2',lvUp:['fh','st']}];
const BOSSES=[
 {n:'Cái đá',d:'Chỉ đánh tối đa 4 lá',max:4},
 {n:'Cái chuông',d:'Lá lẻ và Át không ghi điểm',deb:c=>c.r==14||(c.r<=9&&c.r%2==1)},
 {n:'Cái răng',d:'Mất $1 mỗi lần đánh',tax:1},
 {n:'Cái xanh',d:'Lá ♠ không ghi điểm',deb:c=>c.s==0},
 {n:'Cái hoa',d:'Lá ♣ không ghi điểm',deb:c=>c.s==3},
 {n:'Cái cối',d:'Lá ♦ không ghi điểm',deb:c=>c.s==2},
 {n:'Cái đầu',d:'Lá ♥ không ghi điểm',deb:c=>c.s==1},
 {n:'Cái cột',d:'J, Q, K không ghi điểm',deb:c=>c.r>=11&&c.r<=13},
 {n:'Cái móc',d:'Mỗi lần đánh, mất 2 lá ngẫu nhiên trên tay',hook:1},
 {n:'Cái nọc',d:'Chỉ có 1 lượt xả',disc:1},
 {n:'Cái khóa',d:'Joker ngoài cùng bên phải bị vô hiệu hóa',jokerDeb:1},
 {n:'Cái gương',d:'Joker ngoài cùng bên trái bị vô hiệu hóa',jokerLeftDeb:1},
 {n:'Cái khuôn',d:'Chỉ được đánh đúng 5 lá',exact:5},
 {n:'Cái màn',d:'Chỉ được đánh đúng 1 lá',exact:1},
 {n:'Cái nợ',d:'Mất $2 mỗi lần đánh',tax:2},
 {n:'Cái hộp',d:'Không nhận tiền lãi cuối vòng',noInterest:1},
 {n:'Cái câm',d:'Không được xả bài',disc:0},
 {n:'Cái kim',d:'Không được đánh Đôi',ban:['p1']},
 {n:'Cái lưỡi',d:'Không được đánh Bài cao',ban:['hc']},
 {n:'Cái cân',d:'Chips gốc của mỗi lá giảm một nửa',half:1},
 {n:'Cái ảo ảnh',d:'Joker ở giữa bị vô hiệu hóa',jokerMidDeb:1},
 {n:'Cái tay nhỏ',d:'Cỡ tay −2',hsd:-2},
 {n:'Cái ví',d:'Không có tiền thưởng vòng này',noReward:1},
 {n:'Cái lỗ',d:'Bộ bài bị mất 10 lá ngẫu nhiên',cut:10},
 {n:'Cái sương mù',d:'Khoảng 1/3 bộ bài bị vô hiệu hóa',deb:c=>c.id%3==0}
];
const EN_DECKS=[
 ['Large Deck','+1 hand size, −1 discard'],
 ['Checkered Deck','Only ♠ and ♥ cards (26 cards)'],
 ['Red Deck','+1 discard'],
 ['Blue Deck','+1 hand'],
 ['Black Deck','+1 Joker slot, −1 hand'],
 ['Yellow Deck','Start with $10'],
 ['Plasma Deck','+1 hand, +1 discard, −1 hand size'],
 ['Green Deck','Start with $14, −1 hand'],
 ['Abandoned Deck','Remove J, Q, K (40 cards), +1 consumable slot'],
 ['Erratic Deck','Start with level 2 Full House and Straight']
];
const EN_HANDS={sf:'Straight Flush',flh:'Flush House',five:'Five of a Kind',f4:'Four of a Kind',fh:'Full House',fl:'Flush',st:'Straight',t3:'Three of a Kind',p2:'Two Pair',p1:'Pair',hc:'High Card'};
function dataText(value,english){return currentLang=='en'?english:value}
function dataLabel(group,item,field){const entry=TEXT[currentLang][group]&&TEXT[currentLang][group][item.n];return entry&&entry[field]||item[field]}
function handLabel(type){return dataText(HT[type][0],EN_HANDS[type])}
const T=[{n:'Kính',d:'1 lá chọn: ×2 Mult nhưng có thể vỡ (25%)',enh:'glass',max:1},{n:'Vàng',d:'1 lá chọn: +$3 nếu giữ trên tay cuối vòng',enh:'gold',max:1},{n:'Dấu đỏ',d:'1 lá chọn: kích hoạt lại khi ghi điểm',seal:'red',max:1},{n:'Sức mạnh',d:'Tăng 1 bậc cho ≤2 lá chọn',up:1,max:2},{n:'Hoàng hậu',d:'1 lá chọn: ×1.5 Mult khi ghi điểm',enh:'x',max:1},{n:'Công lý',d:'Nhận ngay $6',cash:6},{n:'Mặt trời',d:'Đổi ≤3 lá chọn thành ♥',s:1},{n:'Mặt trăng',d:'Đổi ≤3 lá chọn thành ♣',s:3},{n:'Ngôi sao',d:'Đổi ≤3 lá chọn thành ♦',s:2},{n:'Thế giới',d:'Đổi ≤3 lá chọn thành ♠',s:0},{n:'Pháp sư',d:'1 lá chọn: +30 Chips khi ghi điểm',enh:'chip',max:1},{n:'Nữ tư tế',d:'1 lá chọn: +4 Mult khi ghi điểm',enh:'mult',max:1},{n:'Hành quyết',d:'Xóa ≤2 lá chọn khỏi bộ bài',kill:1,max:2},{n:'Ẩn sĩ',d:'Nhân đôi tiền (tối đa +$20)',gold:1},{n:'Đá',d:'Lá chọn thành Stone: +50 Chips, không có chất',enh:'stone',max:1},{n:'Hoang dã',d:'Lá chọn có thể thuộc mọi chất',enh:'wild',max:1},{n:'May mắn',d:'Lá chọn: 20% +20 Mult, 10% nhận $1',enh:'lucky',max:1},{n:'Thưởng',d:'Lá chọn: +30 Chips khi ghi điểm',enh:'bonus',max:1},{n:'Bánh xe vận mệnh',d:'Gắn Foil/Holo/Poly lên 1 Joker ngẫu nhiên chưa có Edition (xác suất 50%)',fn:()=>{if(Math.random()<.5){const a=G.jokers.filter(j=>!j.ed);if(a.length){const j=a[Math.random()*a.length|0];j.ed=['foil','holo','poly'][Math.random()*3|0];j.d+=' ('+{foil:'+50 Chips',holo:'+10 Mult',poly:'×1.5 Mult'}[j.ed]+')'}else G.msg='Không có Joker nào để gắn Edition'}else G.msg='Bánh xe: không may mắn lần này'}}
,{n:'Tiết chế',d:'Nhận tiền bằng tổng giá bán các Joker (tối đa $50)',fn:()=>{G.money+=Math.min(50,G.jokers.reduce((n,j)=>n+Math.floor(j.cost/2),0))}}
,{n:'Hoàng đế',d:'Tạo tối đa 2 Tarot ngẫu nhiên',fn:()=>{for(let i=0;i<2;i++)if(G.cons.length<G.consMax+1)G.cons.push(T[Math.random()*T.length|0])}}
,{n:'Người tình',d:'Tối đa 2 lá chọn thành Wild',enh:'wild',max:2}
,{n:'Giáo hoàng',d:'Tối đa 2 lá chọn nhận +4 Mult khi ghi điểm',enh:'mult',max:2}
,{n:'Người treo',d:'Xóa tối đa 2 lá chọn khỏi bộ bài',kill:1,max:2}
,{n:'Cỗ xe',d:'Tối đa 2 lá chọn thành Steel',enh:'steel',max:2}
,{n:'Quỷ dữ',d:'Tối đa 2 lá chọn thành Gold',enh:'gold',max:2}
,{n:'Tòa tháp',d:'Tối đa 2 lá chọn thành Stone',enh:'stone',max:2}
,{n:'Cái chết',d:'Sao chép Enhancement và Seal từ lá đầu sang lá thứ hai',copyCard:1,max:2}
];
const VO=[{n:'Tay lớn',d:'+1 cỡ tay (9 lá)',k:'hs'},{n:'Thêm lượt đánh',d:'+1 lượt đánh mỗi vòng',k:'h'},{n:'Thêm lượt xả',d:'+1 lượt xả mỗi vòng',k:'d'},{n:'Hội viên',d:'Joker trong shop giảm $1',k:'shop',v:1},{n:'Thẻ giảm giá',d:'Mọi vật phẩm shop giảm $1',k:'discount',v:1},{n:'Hộp lớn',d:'Mỗi pack thêm 1 lựa chọn',k:'pack',v:1},{n:'Kho chứa',d:'Thêm 1 ô consumable',k:'cons',v:1},{n:'Phiếu miễn phí',d:'Mỗi cửa hàng có 1 lần reroll miễn phí',k:'freeReroll',v:1},{n:'Két sắt',d:'Tăng giới hạn lãi tối đa lên $10',k:'interest',v:1},{n:'Quỹ tiết kiệm',d:'+$2 cuối mỗi vòng',k:'fund',v:1},{n:'Ô Joker',d:'+1 ô Joker',k:'jslot',v:1},{n:'Mã giảm reroll',d:'Giá reroll khởi điểm chỉ còn $3',k:'rrDisc',v:1},{n:'Quầy hàng lớn',d:'Cửa hàng bày thêm 1 Joker',k:'jshop',v:1}];
const bossNow=()=>G.bosses[(G.ante-1)%G.bosses.length];
const debuffed=c=>!!(G.boss&&G.boss.deb&&G.boss.deb(c));
const jokerDisabled=j=>!!(G.boss&&((G.boss.jokerDeb&&G.jokers[G.jokers.length-1]===j)||(G.boss.jokerLeftDeb&&G.jokers[0]===j)||(G.boss.jokerMidDeb&&G.jokers[Math.floor(G.jokers.length/2)]===j)));
function burst(text,kind=''){
 const el=document.createElement('span');el.className='float '+kind;el.textContent=text;
 el.style.left=(35+Math.random()*30)+'%';el.style.top=(35+Math.random()*25)+'%';
 $('#fx').appendChild(el);setTimeout(()=>el.remove(),950);
}
const ED={foil:'Foil',holo:'Holo',poly:'Poly'},mk=j=>{const o={...j};o.rarity=o.rarity||((o.cost>=9&&Math.random()<.35)?'rare':(Math.random()<.25?'uncommon':'common'));if(G&&G.stake>=2&&Math.random()<.15)o.rental=1;if(G&&G.stake>=3&&Math.random()<.2){o.perishable=1;o.pLeft=5}if(Math.random()<.2){o.ed=['foil','holo','poly'][Math.random()*3|0];o.cost+=2;o.d+=' ('+{foil:'+50 Chips',holo:'+10 Mult',poly:'×1.5 Mult'}[o.ed]+')'}return o};
const SP=[{n:'Bùa vàng',d:'1 lá chọn: Dấu vàng (+$3 khi ghi điểm)',seal:'gold',max:1},{n:'Bùa xanh',d:'1 lá chọn: Dấu xanh (giữ cuối vòng: nâng cấp tổ hợp vừa đánh)',seal:'blue',max:1},{n:'Bùa tím',d:'1 lá chọn: Dấu tím (xả lá này nhận 1 Tarot)',seal:'purple',max:1},{n:'Bùa thép',d:'1 lá chọn: Thép (×1.5 Mult khi giữ trên tay)',enh:'steel',max:1},{n:'Hố đen',d:'Nâng cấp mọi tổ hợp +1',fn:()=>HAND_KEYS.forEach(k=>G.lv[k]++)},{n:'Ngoại chất',d:'Gắn Poly lên 1 Joker ngẫu nhiên',fn:()=>{const a=G.jokers.filter(j=>!j.ed);if(a.length){const j=a[Math.random()*a.length|0];j.ed='poly';j.d+=' (×1.5 Mult)'}}},{n:'Thiêu đốt',d:'Hủy 3 lá ngẫu nhiên trên tay, nhận $20',fn:()=>{shuffle(G.hand.slice()).slice(0,3).forEach(c=>{G.dead.add(c.id);G.hand.splice(G.hand.indexOf(c),1)});G.money+=20}},{n:'Dấu ấn',d:'Đổi toàn bộ lá trên tay thành 1 chất ngẫu nhiên',fn:()=>{const s=Math.random()*4|0;G.hand.forEach(c=>{G.mods[c.id]=G.mods[c.id]||{};G.mods[c.id].s=c.s=s})}},{n:'Linh hồn',d:'Tạo 1 Joker Huyền thoại (cần ô trống)',fn:()=>{if(G.jokers.length<G.slots){const o=JL.filter(j=>!G.jokers.some(q=>q.n==j.n));if(o.length)G.jokers.push(mk(o[Math.random()*o.length|0]))}}},{n:'Bùa đỏ',d:'1 lá chọn: Dấu đỏ (kích hoạt lại)',seal:'red',max:1},{n:'Nhân bản',d:'Sao chép 1 Joker ngẫu nhiên nếu còn ô',fn:()=>{if(G.jokers.length&&G.jokers.length<G.slots){const j=G.jokers[Math.random()*G.jokers.length|0];G.jokers.push({...j,v:0})}}},{n:'Cầu nguyện',d:'Nâng cấp 3 tổ hợp ngẫu nhiên +1',fn:()=>{for(let i=0;i<3;i++)G.lv[HAND_KEYS[Math.random()*HAND_KEYS.length|0]]++}},{n:'Ngoại chất tối',d:'Gắn Holo lên 1 Joker ngẫu nhiên, −1 cỡ tay vĩnh viễn',fn:()=>{const a=G.jokers.filter(j=>!j.ed);if(a.length){const j=a[Math.random()*a.length|0];j.ed='holo';j.d+=' (+10 Mult)';G.vo.hs=(G.vo.hs||0)-1}}},{n:'Thống trị',d:'Nâng cấp một tổ hợp ngẫu nhiên lên 3 cấp',fn:()=>{G.lv[HAND_KEYS[Math.random()*HAND_KEYS.length|0]]+=3}},{n:'Lời nguyền',d:'Xóa một Joker ngẫu nhiên, nhận $25',fn:()=>{if(G.jokers.length){G.jokers.splice(Math.random()*G.jokers.length|0,1);G.money+=25}}}];
const ACH={win:'Thắng ván đầu tiên',s4:'Thắng ở độ khó 4',duo:'Thắng bằng Bộ nhị sắc',m:'Một triệu điểm trong một lần đánh',ed:'Có 3 Joker mang Edition cùng lúc'};
function storageError(message){if(G)G.saveError=message;console.warn(message)}
function ach(k){try{const a=JSON.parse(localStorage.getItem(ACH_KEY)||'{}');if(!a[k]){a[k]=1;localStorage.setItem(ACH_KEY,JSON.stringify(a));G.tagmsg=G.msg='Thành tựu: '+ACH[k]}}catch(e){storageError(tr('Save unavailable'))}}
function achTxt(){let a={};try{a=JSON.parse(localStorage.getItem(ACH_KEY)||'{}')}catch(e){storageError(tr('Save unavailable'))}return Object.keys(ACH).map(k=>(a[k]?'✔ ':'✘ ')+ACH[k]).join('<br>')}
const TAGS=[{n:'Tag tiền',d:'+$7',f:()=>{G.money+=7}},{n:'Tag Hành tinh',d:'nâng cấp 1 tổ hợp ngẫu nhiên',f:()=>{G.lv[HAND_KEYS[Math.random()*HAND_KEYS.length|0]]++}},{n:'Tag Joker',d:'1 Joker ngẫu nhiên nếu còn ô',f:()=>{if(G.jokers.length<G.slots){const o=J.filter(j=>!G.jokers.some(q=>q.n==j.n));if(o.length)G.jokers.push(mk(o[Math.random()*o.length|0]))}}},{n:'Tag Tarot',d:'1 Tarot nếu còn chỗ',f:()=>{if(G.cons.length<G.consMax)G.cons.push(T[Math.random()*T.length|0])}},{n:'Tag Pack',d:'Nhận 1 pack miễn phí ở shop',f:()=>{G.freePack=1}},{n:'Tag Coupon',d:'Reroll kế tiếp miễn phí',f:()=>{G.freeReroll=1}},{n:'Tag Double',d:'Nhân đôi tiền hiện có, tối đa +$20',f:()=>{G.money+=Math.min(20,G.money)}}];
function skipB(){const tg=TAGS[Math.random()*TAGS.length|0];tg.f();G.tagmsg='Nhận '+tg.n+' ('+tg.d+')';nextBlind()}
const rmSave=()=>{try{localStorage.removeItem(SAVE_KEY)}catch(e){storageError(tr('Save unavailable'))}},hasSave=()=>{try{return !!localStorage.getItem(SAVE_KEY)}catch(e){storageError(tr('Save unavailable'));return false}};
function save(){try{const data={version:1,a:G.ante,r:G.rd,m:G.money,j:G.jokers.map(j=>[j.n,j.v,j.ed,j.d,j.cost,j.rarity,j.rental,j.perishable,j.pLeft]),lv:G.lv,c:G.cons.map(t=>t.n),mods:G.mods,dead:[...G.dead],vo:G.vo,bs:G.bosses.map(b=>b.n),dk:DECKS.indexOf(G.dk),sl:G.slots,en:G.endless,st:G.stake,sa:G.stakeApplied,freePack:G.freePack,freeReroll:G.freeReroll,consMax:G.consMax,lang:currentLang};localStorage.setItem(SAVE_KEY,JSON.stringify(data));if(JSON.parse(localStorage.getItem(SAVE_KEY)).a!==G.ante)throw Error('save verification failed');G.saveError=''}catch(e){storageError(tr('Save error'))}}
function load(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)throw Error('missing save');const s=JSON.parse(raw),f=(a,n)=>a.find(x=>x.n==n);if(!s||!Array.isArray(s.j)||!s.lv||!Array.isArray(s.bs)||DECKS[s.dk]==null)throw Error('invalid save');const jk=(n,v,ed,d,cost,rarity,rental,perishable,pLeft)=>{const base=f(ALL_JOKERS,n);if(!base)throw Error('unknown joker');const o={...base,v,ed,rarity:rarity||((base.cost>=9)?'rare':'common'),rental,perishable,pLeft:pLeft||5};if(d)o.d=d;if(cost)o.cost=cost;return o};
 G={ante:s.a,rd:s.r,money:s.m,jokers:s.j.map(q=>jk(...q)),lv:s.lv,phase:'blind',sel:new Set(),msg:'',busy:false,cons:s.c.map(n=>f(T,n)||f(SP,n)).filter(Boolean),consMax:s.consMax||2,mods:s.mods||{},dead:new Set(s.dead||[]),vo:Object.assign({hs:0,h:0,d:0,shop:0,discount:0,pack:0,cons:0,freeReroll:0,interest:0},s.vo),bosses:s.bs.map(n=>f(BOSSES,n)).filter(Boolean),dk:DECKS[s.dk],slots:s.sl||5,endless:!!s.en,packs:[],stake:s.st||1,stakeApplied:!!s.sa,freePack:s.freePack||0,freeReroll:s.freeReroll||0,lang:s.lang||currentLang};currentLang=G.lang==='en'?'en':'vi';document.documentElement.lang=currentLang;document.documentElement.dataset.lang=currentLang;G.msg=tr('Save restored');G.saveError='';return true}catch(e){storageError(tr('Save corrupted'));return false}}
function stat(w){try{const s=JSON.parse(localStorage.getItem(STATS_KEY)||'{}');s.runs=(s.runs||0)+1;s.best=Math.max(s.best||0,G.ante);if(w){s.wins=(s.wins||0)+1;ach('win');if(G.stake==4)ach('s4');if(G.dk&&G.dk.n=='Bộ nhị sắc')ach('duo')}localStorage.setItem(STATS_KEY,JSON.stringify(s))}catch(e){storageError(tr('Save unavailable'))}}
function statTxt(){try{const s=JSON.parse(localStorage.getItem(STATS_KEY)||'{}');return s.runs?`${tr('Played')} ${s.runs}, ${s.wins||0} ${tr('Wins')}, ${tr('Highest ante')} ${s.best}`:''}catch(e){storageError(tr('Save unavailable'));return ''}}
function col(){$('#modal').innerHTML=`<div class="modal"><div class="mb"><h2>${tr('Achievements')}</h2><p>${achTxt()}</p><h2>${tr('Jokers')} (${ALL_JOKERS.length})</h2><table>${ALL_JOKERS.map(j=>`<tr><td>${j.n}</td><td>$${j.cost}</td><td>${j.d}</td></tr>`).join('')}</table><div class="row" style="margin-top:12px"><button class="b-blue" id="cx">${tr('Close')}</button></div></div></div>`;$('#cx').onclick=()=>$('#modal').innerHTML=''}
const AC=window.AudioContext||window.webkitAudioContext;let ac,mute=false;
function snd(f,d=.08,ty='square'){if(mute||!AC)return;try{ac=ac||new AC();const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch(e){}}
const TB=a=>TARGET[a-1]||Math.round(TARGET[7]*Math.pow(2.2,a-8));
const STAKE_NAMES={vi:['Thường','Đỏ','Cam','Vàng'],en:['Standard','Red','Orange','Gold']};
const stakeName=s=>(TEXT[currentLang]['Stake names']||STAKE_NAMES[currentLang])[s-1]||(currentLang=='en'?'Endless':'Vô hạn');
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}
function newGame(){
 G={ante:1,rd:0,money:4,jokers:[],lv:Object.fromEntries(HAND_KEYS.map(k=>[k,1])),phase:'deck',sel:new Set(),msg:'',busy:false,cons:[],consMax:2,mods:{},dead:new Set(),vo:{hs:0,h:0,d:0,shop:0,discount:0,pack:0,cons:0,freeReroll:0,interest:0},bosses:shuffle(BOSSES.slice()),dk:null,slots:5,endless:false,packs:[],stake:G&&G.stake||1,stakeApplied:false,freePack:0,freeReroll:0};
 render();
}
function freshDeck(){let d=[],id=0;for(let s=0;s<4;s++)for(let r=2;r<=14;r++){const m=G.mods[id];if(!G.dead.has(id)&&(!G.dk.suits||G.dk.suits.includes(s))&&(!G.dk.noFace||r<11||r==14))d.push({id,r,s,...m});id++}return shuffle(d)}
function target(){return Math.round(TB(G.ante)*BL[G.rd].k*(1+.25*(G.stake-1)))}
function startBlind(){
 if(!G.stakeApplied){if(G.stake==2)G.money=Math.max(0,G.money-1);if(G.stake==3)G.money=Math.max(0,G.money-2);G.stakeApplied=true}
 G.deck=freshDeck();G.hand=[];G.score=0;G.boss=BL[G.rd].c=='boss'?bossNow():null;const D=G.dk;G.hands=4+(D.hands||0)+G.vo.h+G.jokers.filter(j=>j.hh).length-(G.boss?1:0);G.disc=Math.min(3+(D.disc||0)+G.vo.d-(G.stake>=3?1:0),G.boss&&G.boss.disc!=null?G.boss.disc:99);if(G.boss&&G.boss.disc===0)G.disc=0;G.hs=Math.max(1,8+G.vo.hs+(G.dk.hs||0)+(G.boss&&G.boss.hsd||0)+G.jokers.filter(j=>j.hsz).length);G.sel=new Set();G.msg='';G.last=null;G.phase='play';G.tagmsg='';if(G.boss&&G.boss.cut)G.deck.splice(0,G.boss.cut);draw();render();
}
function draw(){while(G.hand.length<G.hs&&G.deck.length)G.hand.push(G.deck.pop());sortHand(G.sortBy||'r')}
function sortHand(by){G.sortBy=by;G.hand.sort((a,b)=>by=='r'?b.r-a.r||a.s-b.s:a.s-b.s||b.r-a.r)}
function ev(cs){
 const active=cs.filter(c=>c.enh!='stone'),n=active.length,cnt={};active.forEach(c=>cnt[c.r]=(cnt[c.r]||0)+1);
 const g=Object.entries(cnt).map(([r,k])=>({r:+r,k})).sort((a,b)=>b.k-a.k||b.r-a.r);
 const FF=G.jokers.some(j=>j.four),SC=G.jokers.some(j=>j.gap),need=FF?4:5;
 const isF=s=>s.length>=need&&s.every(c=>c.enh!='stone'&&(c.enh=='wild'||s[0].enh=='wild'||c.s==s[0].s));
 const isS=s=>{const r=[...new Set(s.map(c=>c.r))].sort((a,b)=>a-b);if(r.length!=s.length||s.length<need)return false;const q=a=>a.every((v,i)=>!i||v-a[i-1]<=(SC?2:1));return q(r)||(r[r.length-1]==14&&q([1,...r.slice(0,-1)]))};
 const sets=FF&&n==5?[active,...active.map((_,i)=>active.filter((_,j)=>j!=i))]:[active];
 const fl=sets.find(isF),st=sets.find(isS),sf=sets.find(s=>isF(s)&&isS(s));
 const take=k=>active.filter(c=>g.filter(x=>x.k>=k).some(x=>x.r==c.r));
 let t,sc;
 if(sf){t='sf';sc=sf}else if(fl&&g[0]&&g[0].k==3&&g[1]&&g[1].k==2){t='flh';sc=fl}else if(g[0]&&g[0].k==5){t='five';sc=active}else if(g[0]&&g[0].k==4){t='f4';sc=take(4)}else if(g[0]&&g[0].k==3&&g[1]&&g[1].k==2){t='fh';sc=active}
 else if(fl){t='fl';sc=fl}else if(st){t='st';sc=st}else if(g[0]&&g[0].k==3){t='t3';sc=take(3)}
 else if(g[0]&&g[0].k==2&&g[1]&&g[1].k==2){t='p2';sc=take(2)}else if(g[0]&&g[0].k==2){t='p1';sc=take(2)}
 else{t='hc';sc=active.length?[active.reduce((a,b)=>b.r>a.r?b:a)]:[]}
 return{t,sc:sc.concat(cs.filter(c=>c.enh=='stone')),pair:g[0]&&g[0].k>=2,tri:g[0]&&g[0].k>=3}
}
function lvStats(t){const h=HT[t],l=G.lv[t]-1;return[h[1]+h[3]*l,h[2]+h[4]*l]}
function addEffect(state,result,label,id,tr){
 if(!result)return;
 state.ch+=result[0]||0;
 state.mu+=result[1]||0;
 if(result[2])state.mu*=result[2];
 if(label)tr.push({id:id||-1,l:label,ch:state.ch,mu:state.mu});
}
function jokerEd(j,state,tr,when){
 if(when=='pre'){if(j.ed=='foil')addEffect(state,[50,0],'Foil',-1,tr);if(j.ed=='holo')addEffect(state,[0,10],'Holo',-1,tr)}
 else if(j.ed=='poly')addEffect(state,[0,0,1.5],'Poly',-1,tr);
}
function triggerJokers(stage,payload,state,tr){
 G.jokers.forEach(j=>{
  if(jokerDisabled(j))return;
  let result;
  if(stage=='card'&&j.card)result=j.card(payload,j);
  if(stage=='held'&&j.held)result=j.held(payload,j);
  if(result)addEffect(state,result,j.n,payload&&payload.id,tr);
 });
}
function retriggers(c,ci,scoring){
 let n=c.seal=='red'?1:0;
 G.jokers.forEach(j=>{if(jokerDisabled(j))return;if(j.repeat&&scoring&&ci===0)n+=j.repeat;if(j.rep&&scoring)n+=j.rep(c,ci)||0;if(j.repHeld&&!scoring)n+=j.repHeld(c)||0});
 return n;
}
function calc(cs,commit=false){
 const e=ev(cs);let[ch,mu]=lvStats(e.t);
 const tr=[{l:handLabel(e.t)+' '+TEXT[currentLang].level+' '+G.lv[e.t],ch,mu}];
 const x={t:e.t,last:G.hands==1,n:cs.length,pair:e.pair,tri:e.tri,disc:G.disc,jn:G.jokers.length,money:G.money,suits:new Set(cs.filter(c=>c.enh!='stone').map(c=>c.enh=='wild'?'wild':c.s)).size,enh:new Set(cs.map(c=>c.enh).filter(Boolean)).size,wild:cs.some(c=>c.enh=='wild'),stone:cs.some(c=>c.enh=='stone'),scored:e.sc.length,held:G.hand.filter(c=>!cs.includes(c)).length,hands:G.hands-(commit?1:0)};
 const state={ch,mu};
 /* 1) Lá ghi điểm: chip gốc -> enhancement -> seal -> joker "on scored"; retrigger lặp lại toàn bộ chuỗi */
 e.sc.forEach((c,ci)=>{
  if(debuffed(c))return;
  const reps=retriggers(c,ci,true);
  for(let k=0;k<=reps;k++){
   state.ch+=c.enh=='stone'?50:(G.boss&&G.boss.half?Math.ceil(cv(c.r)/2):cv(c.r));
   if(c.enh=='chip'||c.enh=='bonus')state.ch+=30;
   if(c.enh=='mult')state.mu+=4;
   if(c.enh=='glass')state.mu*=2;
   if(c.enh=='x')state.mu*=1.5;
   if(commit&&c.enh=='lucky'){if(Math.random()<.2){state.mu+=20;tr.push({id:c.id,l:'May mắn +20 Mult',ch:state.ch,mu:state.mu})}if(Math.random()<.1){G.money++;tr.push({id:c.id,l:'May mắn +$1',ch:state.ch,mu:state.mu})}}
   if(commit&&c.seal=='gold'){G.money+=3}
   tr.push({id:c.id,l:(c.enh=='stone'?'Stone':(RN[c.r]||c.r)+SU[c.s])+(k?' ↻':''),ch:state.ch,mu:state.mu});
   triggerJokers('card',c,state,tr);
  }
 });
 /* 2) Lá giữ trên tay (Steel, Joker "in hand"); Red Seal cũng retrigger lá giữ trên tay */
 G.hand.forEach((c,hi)=>{
  if(debuffed(c)||cs.includes(c)||c.enh=='stone')return;
  const reps=retriggers(c,hi,false);
  for(let k=0;k<=reps;k++){
   if(c.enh=='steel'){state.mu*=1.5;tr.push({id:c.id,l:'Thép'+(k?' ↻':''),ch:state.ch,mu:state.mu})}
   triggerJokers('held',c,state,tr);
  }
 });
 /* 3) Joker từ trái sang phải: Foil/Holo -> hiệu ứng Joker -> Poly */
 G.jokers.forEach(j=>{
  if(jokerDisabled(j))return;
  jokerEd(j,state,tr,'pre');
  if(j.hand)addEffect(state,j.hand(x,j),j.n,-1,tr);
  jokerEd(j,state,tr,'post');
 });
 return{e,tr,ch:state.ch,mu:state.mu,total:Math.round(state.ch*state.mu)}
}
function toggle(id){
 if(G.busy)return;
 snd(G.sel.has(id)?300:520,.05);if(G.sel.has(id))G.sel.delete(id);else if(G.sel.size<(G.boss&&G.boss.max||5))G.sel.add(id);
 render();
}
function play(){
 const cs=G.hand.filter(c=>G.sel.has(c.id));if(!cs.length||G.busy)return;
 if(G.boss&&G.boss.exact&&cs.length!==G.boss.exact){G.msg='Boss yêu cầu đánh đúng '+G.boss.exact+' lá';render();return}
 {const bt=ev(cs).t;if(G.boss&&G.boss.ban&&G.boss.ban.includes(bt)){G.msg='Boss cấm đánh '+HT[bt][0];render();return}}
 const r=calc(cs,true);if(r.total>=1000000)ach('m');G.busy=true;G.hands--;G.last=r;r.e.sc.forEach(c=>{if(!debuffed(c)&&c.enh=='glass'&&Math.random()<.25){G.dead.add(c.id);burst('KÍNH VỠ','red')}});G.played=cs;G.step=null;G.jokers.forEach(j=>{if(j.grow)j.v=(j.v||0)+1});r.tr.forEach((s,i)=>setTimeout(()=>{G.step=s;snd(330+i*60,.12);burst(s.l,s.l=='Foil'||s.l=='Holo'||s.l=='Poly'?'blue':'');render()},350*(i+1)));setTimeout(()=>{G.score+=r.total;burst('+'+r.total.toLocaleString(),'big');G.played=null;G.step=null;render()},350*(r.tr.length+1));
 G.msg=handLabel(r.e.t)+'! +'+r.total.toLocaleString();if(G.boss&&G.boss.tax)G.money=Math.max(0,G.money-G.boss.tax);if(G.boss&&G.boss.hook){const rest=G.hand.filter(c=>!G.sel.has(c.id));shuffle(rest).slice(0,2).forEach(c=>G.hand.splice(G.hand.indexOf(c),1))}
 G.hand=G.hand.filter(c=>!G.sel.has(c.id));G.sel=new Set();render();
 setTimeout(()=>{
  G.busy=false;
  if(G.score>=target())return win();
  if(G.hands<=0){G.phase='over';stat(0);rmSave();snd(120,.5,'sawtooth');return render()}
  draw();render();
 },350*(G.last.tr.length+1)+900);
}
function discard(){
 if(G.disc<=0||!G.sel.size||G.busy)return;
 G.disc--;const x={n:G.sel.size,disc:G.disc,jn:G.jokers.length};G.hand.filter(c=>G.sel.has(c.id)&&c.seal=='purple').forEach(()=>{if(G.cons.length<G.consMax)G.cons.push(T[Math.random()*T.length|0])});G.jokers.forEach(j=>{if(j.dm)G.money+=j.dm;if(j.discard){const r=j.discard(x,j);if(r){G.msg=(j.n+' '+(r[1]?'+'+r[1]+' Mult':'+'+r[0]+' Chips'));burst(G.msg,'blue')}}});G.hand=G.hand.filter(c=>!G.sel.has(c.id));G.sel=new Set();G.last=null;G.msg=G.msg||'';draw();render();
}
function win(){
 const b=BL[G.rd],int=G.boss&&G.boss.noInterest?0:Math.min(G.vo.interest?10:5,Math.floor(G.money/5)),gold=(G.vo.fund?2:0)+G.jokers.reduce((s,j)=>s+(j.gold||0),0)+3*G.hand.filter(c=>c.enh=='gold'||c.seal=='gold').length;
 const endBonus=G.jokers.reduce((s,j)=>s+(typeof j.end=='function'?j.end({jn:G.jokers.length,money:G.money})||0:(j.end||0)),0),rental=G.jokers.filter(j=>j.rental).length*3,gain=(G.boss&&G.boss.noReward?0:b.r)+G.hands+int+gold+endBonus-rental;G.money=Math.max(0,G.money+gain);G.hand.filter(c=>c.seal=='blue').forEach(()=>{if(G.last)G.lv[G.last.e.t]++});
 G.jokers=G.jokers.filter(j=>{if(!j.perishable)return true;j.pLeft=(j.pLeft||5)-1;if(j.pLeft<=0){burst(j.n+' hết hạn','red');return false}return true});
 G.gain={base:b.r,hands:G.hands,int,gold,end:endBonus,sum:gain};
 if(G.rd==2&&G.ante==8&&!G.endless){G.phase='won';stat(1);rmSave();return render()}
 snd(660,.3,'triangle');G.phase='cash';render();
}
function openShop(){
 G.rr=G.vo.rrDisc?3:5;G.freeReroll=G.vo.freeReroll?1:0;G.phase='shop';rollShop();render();
}
function rollShop(){
 const owned=G.jokers.map(j=>j.n);
 G.shop=shuffle(J.filter(j=>!owned.includes(j.n))).slice(0,3+(G.vo.jshop||0)).map(mk);
 G.planets=shuffle(HAND_KEYS).slice(0,2);G.packs=shuffle([{k:'j',n:3,cost:4,label:'Joker'},{k:'t',n:3,cost:4,label:'Tarot'},{k:'p',n:3,cost:4,label:'Hành tinh'},{k:'s',n:3,cost:4,label:'Spectral'},{k:'j',n:5,cost:6,label:'Mega Joker'},{k:'t',n:5,cost:6,label:'Mega Tarot'}]).slice(0,2);if(G.freePack){G.packs[0].cost=0;G.packs[0].free=1;G.freePack=0}G.packs.forEach(p=>p.n+=G.vo.pack||0);G.tarots=shuffle(T.slice()).slice(0,2);const vl=VO.filter(v=>!G.vo[v.k]);G.voc=vl.length?vl[Math.random()*vl.length|0]:null;
}
function price(n,kind){return Math.max(0,n+(G.stake>=4?1:0)-(kind=='joker'?G.vo.shop||0:0)-(G.vo.discount||0))}
function buyJ(i){const j=G.shop[i],cost=price(j.cost+(j.rental?1:0),'joker');if(G.money<cost||G.jokers.length>=G.slots)return;G.money-=cost;snd(880,.1);G.jokers.push(j);if(G.jokers.filter(q=>q.ed).length>=3)ach('ed');G.shop.splice(i,1);render()}
function buyP(i){const cost=price(3);if(G.money<cost)return;G.money-=cost;G.lv[G.planets[i]]++;G.planets.splice(i,1);render()}
function sell(i){G.money+=Math.floor(G.jokers[i].cost/2);G.jokers.splice(i,1);render()}
function moveJoker(i,delta){const to=i+delta;if(to<0||to>=G.jokers.length)return;[G.jokers[i],G.jokers[to]]=[G.jokers[to],G.jokers[i]];snd(500,.05);render()}
function reroll(){if(!G.freeReroll&&G.money<G.rr)return;if(G.freeReroll)G.freeReroll=0;else G.money-=G.rr;G.rr++;rollShop();render()}
function nextBlind(){
 if(G.rd==2){G.rd=0;G.ante++}else G.rd++;G.phase='blind';render();
}
function cardHTML(c){const red=c.s==1||c.s==2,badge=c.enh?({glass:'KÍNH',gold:'VÀNG',steel:'THÉP',chip:'+CHIP',mult:'+MULT',x:'×MULT',bonus:'+30 CHIP',lucky:'MAY MẮN',wild:'WILD',stone:'STONE'}[c.enh]||''):c.seal?c.seal.toUpperCase():'';const detail=[RN[c.r]||c.r,c.enh&&c.enh.toUpperCase(),c.seal&&c.seal.toUpperCase(),SU[c.s]].filter(Boolean).join(' ');return `<div class="card ${red?'r':''} ${c.enh?'e-'+c.enh:''} ${c.seal?'s-'+c.seal:''} ${debuffed(c)?'debuff':''} ${G.sel.has(c.id)?'sel':''}" role="button" tabindex="0" aria-pressed="${G.sel.has(c.id)}" aria-label="${detail}" title="${detail}" data-id="${c.id}" data-badge="${badge}"><span>${RN[c.r]||c.r}</span><span class="s">${SU[c.s]}</span><span style="text-align:right">${RN[c.r]||c.r}</span></div>`}
function jokerHTML(j,i,shop){const ed=j.ed?` ✦${ED[j.ed]}`:'',cost=shop?price(j.cost+(j.rental?1:0),'joker'):j.cost+(j.rental?1:0),rar=j.rarity||'common',disabled=!shop&&jokerDisabled(j),state=j.rental?(currentLang=='en'?' RENTAL −$3/round':' RENTAL −$3/vòng'):j.perishable?` PERISHABLE (${j.pLeft||5} ${currentLang=='en'?'rounds':'vòng'})`:'' ,sell=Math.floor((j.cost+(j.rental?1:0))/2),rarity=rarityLabel(rar),disabledText=currentLang=='en'?'DISABLED':'VÔ HIỆU HÓA';return `<div class="joker rarity-${rar} ${disabled?'debuff':''}" title="${disabled?(currentLang=='en'?'Disabled by Boss':'Bị Boss vô hiệu hóa'):rarity}"><b>${j.n}${ed}</b><small>${disabled?disabledText:rarity}${state}</small><p>${j.d}${j.grow?` (${j.gs?j.gs(j):'đang +'+2*(j.v||0)})`:''}</p>${shop?`<button class="b-gold" data-buy="${i}" ${G.money<cost||G.jokers.length>=G.slots?'disabled':''}>$${cost}</button>`:`<button class="b-grey" data-sell="${i}">${currentLang=='en'?'Sell':'Bán'} $${sell}</button><div class="row" style="gap:3px;margin-top:4px"><button class="b-grey" style="padding:2px 7px" data-jleft="${i}" ${i?'':'disabled'} aria-label="${currentLang=='en'?'Move Joker left':'Đưa Joker sang trái'}">◀</button><button class="b-grey" style="padding:2px 7px" data-jright="${i}" ${i<G.jokers.length-1?'':'disabled'} aria-label="${currentLang=='en'?'Move Joker right':'Đưa Joker sang phải'}">▶</button></div>`}</div>`}
function side(){
 const b=BL[G.rd];
 let pv=`<small>${tr('Select up to')} ${G.boss&&G.boss.max||5} ${currentLang=='en'?'cards':'lá'}</small>`;
 if(G.phase=='play'){
  const cs=G.hand.filter(c=>G.sel.has(c.id));
  const r=cs.length?calc(cs):G.last;
  if(r)pv=`<div class="hn">${handLabel(r.e.t)} <small style="display:inline">${TEXT[currentLang].level} ${G.lv[r.e.t]}</small></div><div class="cm"><span class="c">${r.ch}</span>×<span class="m">${r.mu}</span></div>`;
 }
 return `<div class="side"><div class="blind ${b.c}">${tr(b.n)}</div>${G.boss&&G.phase=='play'?`<div class="box" style="font-family:system-ui;font-size:.8rem">${dataLabel('Bosses',G.boss,'name')}: ${dataLabel('Bosses',G.boss,'description')}</div>`:''}
 <div class="box"><small>${tr('Target score')}</small><div class="score" style="color:var(--gold)">${target().toLocaleString()}</div></div>
 <div class="box"><small>${tr('Current score')}</small><div class="score">${(G.score||0).toLocaleString()}</div></div>
 <div class="box prev">${G.step?`<div class="hn">${G.step.l}</div><div class="cm"><span class="c">${G.step.ch}</span>×<span class="m">${Math.round(G.step.mu*10)/10}</span></div>`:pv}</div>
 <div class="grid2"><div class="box"><small>${tr('Hands')}</small><span style="color:var(--blue)">${G.hands??'-'}</span></div><div class="box"><small>${tr('Discards')}</small><span style="color:var(--red)">${G.disc??'-'}</span></div>
 <div class="box"><small>${tr('Money')}</small><span class="money">$${G.money}</span></div><div class="box"><small>${tr('Ante')}</small>${G.ante}/8</div></div>
 <button class="b-grey" id="help">${tr('Guide')}</button><button class="b-grey" id="mute">${mute?tr('Sound on'):tr('Sound off')}</button><button class="b-grey" id="lang" aria-label="${tr('Language')}">${currentLang.toUpperCase()} · ${currentLang=='en'?tr('Vietnamese'):tr('English')}</button>${G.saveError?`<small class="save-error">${G.saveError}</small>`:''}</div>`;
}
function render(){
 let m='';
 const ph=G.phase;if(ph=='blind')save();
 if(ph=='deck')m=`<h1 class="tt">${tr('Deck')}</h1><div class="row"><button id="stk" class="b-grey">Stake ${G.stake}/4: ${stakeName(G.stake)}</button><button class="b-grey" title="${tr('Stake rules')}">${currentLang=='en'?'Stake rules':'Luật Stake'}</button><button id="col" class="b-grey">${tr('Jokers')}</button>${hasSave()?`<button id="resume" class="b-gold">${tr('Saved game')}</button>`:''}</div><p style="text-align:center;opacity:.75">${statTxt()}</p><div class="blinds">${DECKS.map((d,i)=>{const n=currentLang=='en'?EN_DECKS[i][0]:d.n,dsc=currentLang=='en'?EN_DECKS[i][1]:d.d;return `<div class="bl cur"><div class="blind">${n}</div><div style="font-family:system-ui">${dsc}</div><button class="b-red" data-dk="${i}">${tr('Choose')}</button></div>`}).join('')}</div>`;
 if(ph=='pack'){m=`<h1 class="tt">${tr('Open pack')}</h1><div class="shopgrid">${G.open.o.map((o,i)=>{const p=G.open.k=='p';return `<div class="item"><div class="planet" style="background:linear-gradient(160deg,#3a8a5c,#12482b);border-color:#9fe8bd"><b style="font-weight:400;color:#fff">${p?HT[o][0]:o.n}</b><br><span style="font-family:system-ui;font-size:.7rem">${p?'+'+HT[o][3]+' Chips, +'+HT[o][4]+' Mult':o.d}</span></div><button class="b-gold" data-pp="${i}">${tr('Pick')}</button></div>`}).join('')}</div><div class="row"><button class="b-grey" id="pskip">${tr('Skip')}</button></div>`}else if(ph=='blind'){
  m=`<h1 class="tt">Ante ${G.ante}</h1><div class="msg">${G.tagmsg||''}</div><div class="blinds">${BL.map((b,i)=>`<div class="bl ${i==G.rd?'cur':''}"><div class="blind ${b.c}">${tr(b.n)}</div><div>${tr('Reach')} <span style="color:var(--gold);font-size:1.4rem">${Math.round(TB(G.ante)*b.k).toLocaleString()}</span></div><div>${tr('Reward')} $${b.r}</div>${b.c=='boss'?`<small style="font-family:system-ui">${dataLabel('Bosses',bossNow(),'name')}: ${dataLabel('Bosses',bossNow(),'description')}. ${tr('Boss hands left')}</small>`:''}${i==G.rd?`<button class="b-red" id="go">${tr('Start')}</button>`:''}${i==G.rd&&i<2?`<button class="b-grey" id="skip">${tr('Skip (get Tag)')}</button>`:''}</div>`).join('')}</div>${jokerRow()}`;
 }else if(ph=='play'){
  m=`${jokerRow()}${consRow()}<div class="msg">${G.msg}</div>${G.played?`<div class="hand">${G.played.map(c=>cardHTML(c).replace('class="card ',G.step&&G.step.id===c.id?'class="card sel ':'class="card ')).join('')}</div>`:''}<div class="hand">${G.hand.map(cardHTML).join('')}</div>
  <div class="row"><button class="b-blue" id="play" ${!G.sel.size||G.busy?'disabled':''}>${tr('Play')}</button><button class="b-red" id="disc" ${!G.sel.size||!G.disc||G.busy?'disabled':''}>${tr('Discard')}</button><button class="b-grey" id="sr">${tr('Sort by rank')}</button><button class="b-grey" id="ss">${tr('Sort by suit')}</button></div>
  <div style="text-align:center;opacity:.7;font-size:.9rem">${tr('Cards left')} ${G.deck.length}</div>`;
 }else if(ph=='cash'){
  const g=G.gain;
  m=`<h1 class="tt">${tr('Round won')}</h1><div class="box" style="max-width:340px;margin:0 auto;width:100%;font-size:1.2rem;line-height:1.8">${tr('Cash reward')}: $${g.base}<br>${tr('Remaining hands')}: $${g.hands}<br>${tr('Interest')} ($1 mỗi $5): $${g.int}${g.gold?`<br>${tr('Bonus gold')}: $${g.gold}`:''}${g.end?`<br>${tr('End of round Jokers')}: $${g.end}`:''}<hr><b class="money">${tr('Total')} +$${g.sum}</b></div><div class="row"><button class="b-gold" id="shop">${tr('Shop')}</button></div>`;
 }else if(ph=='shop'){
  m=`<h1 class="tt">${tr('Shop')}</h1><div class="shopgrid">${G.shop.map((j,i)=>`<div class="item">${jokerHTML(j,i,true)}</div>`).join('')}${G.planets.map((t,i)=>`<div class="item"><div class="planet">Planet<br><b style="font-weight:400;color:#fff">${handLabel(t)}</b><br><span style="font-family:system-ui;font-size:.7rem">+${HT[t][3]} Chips<br>+${HT[t][4]} Mult<br>(${TEXT[currentLang].level} ${G.lv[t]})</span></div><button class="b-gold" data-pl="${i}" ${G.money<price(3)?'disabled':''}>$${price(3)}</button></div>`).join('')}${G.tarots.map((t,i)=>`<div class="item"><div class="planet" style="background:linear-gradient(160deg,#b0488a,#5c1f4a);border-color:#ffb3e0">Tarot<br><b style="font-weight:400;color:#fff">${t.n}</b><br><span style="font-family:system-ui;font-size:.7rem">${t.d}</span></div><button class="b-gold" data-ta="${i}" ${G.money<price(3)||G.cons.length>=G.consMax?'disabled':''}>$${price(3)}</button></div>`).join('')}${G.voc?`<div class="item"><div class="planet" style="background:linear-gradient(160deg,#c78a1c,#6e4708);border-color:#ffe08a">Voucher<br><b style="font-weight:400;color:#fff">${G.voc.n}</b><br><span style="font-family:system-ui;font-size:.7rem">${G.voc.d}</span></div><button class="b-gold" data-vo="1" ${G.money<price(10)?'disabled':''}>$${price(10)}</button></div>`:''}${G.packs.map((p,i)=>{const c=p.free?0:price(p.cost,'pack');return `<div class="item"><div class="planet" style="background:linear-gradient(160deg,#3a8a5c,#12482b);border-color:#9fe8bd">${tr('Pack')} ${p.label}<br><span style="font-family:system-ui;font-size:.7rem">${tr('Pick')} ${p.n}</span></div><button class="b-gold" data-pk="${i}" ${G.money<c?'disabled':''}>${p.free?tr('Free'):'$'+c}</button></div>`}).join('')}</div>
  <div class="row"><button class="b-blue" id="rr" ${!G.freeReroll&&G.money<G.rr?'disabled':''}>${tr('Reroll')} ${G.freeReroll?tr('Free'):'$'+G.rr}</button><button class="b-red" id="next">${tr('Next round')}</button></div>${jokerRow()}`;
 }else if(ph=='over'||ph=='won'){
  m=`<h1 class="tt">${ph=='won'?tr('You win'):tr('You lose')}</h1><p style="text-align:center">${ph=='won'?tr('You cleared the run'):`${tr('Stopped at')} Ante ${G.ante}, ${tr(BL[G.rd].n)}. ${tr('Current score')}: ${G.score.toLocaleString()} / ${target().toLocaleString()}.`}</p><div class="row">${ph=='won'?`<button class="b-gold" id="endless">${tr('Play endless')}</button>`:''}<button class="b-red" id="again">${tr('Play again')}</button></div>`;
 }
 $('#app').innerHTML=side()+`<div class="main">${m}</div>`;
 bind();
}
function jokerRow(){return `<div class="slots" aria-label="Joker">${G.jokers.map((j,i)=>jokerHTML(j,i)).join('')||`<span style="opacity:.6;align-self:center">${tr('No Jokers')} (${G.slots})</span>`}</div>`}
function buyPk(i){const p=G.packs[i],cost=p.free?0:price(p.cost,'pack');if(G.money<cost)return;G.money-=cost;G.packs.splice(i,1);const k=p.k,n=p.n;G.open={k,o:k=='j'?shuffle(J.filter(j=>!G.jokers.some(q=>q.n==j.n))).slice(0,n).map(mk):k=='t'?shuffle(T.slice()).slice(0,n):k=='s'?shuffle(SP.slice()).slice(0,n):shuffle(HAND_KEYS).slice(0,n)};G.phase='pack';render()}
function pickPk(i){const o=G.open.o[i],k=G.open.k;if(k=='j'){if(G.jokers.length>=G.slots){G.msg='';return}G.jokers.push(o)}else if(k=='t'||k=='s'){if(G.cons.length>=G.consMax)return;G.cons.push(o)}else G.lv[o]++;G.open=null;G.phase='shop';render()}
function consRow(){return G.cons.length?`<div class="row">${G.cons.map((t,i)=>`<button style="background:#9a3d7a" data-use="${i}" title="${t.d}">${t.n}: ${t.d}</button>`).join('')}</div>`:''}
function useT(i){const t=G.cons[i];if(G.busy)return;
 if(t.fn){t.fn();G.cons.splice(i,1);G.msg=t.n+'!';if(G.hand.length<G.hs)draw();return render()}
 if(t.cash)G.money+=t.cash;else if(t.gold)G.money+=Math.min(20,G.money);
 else{const cs=G.hand.filter(c=>G.sel.has(c.id)),mx=t.max||3;
  if(!cs.length||cs.length>mx||(t.copyCard&&cs.length!==2)){G.msg=t.copyCard?'Chọn đúng 2 lá trước khi dùng':'Chọn 1–'+mx+' lá trước khi dùng';return render()}
  if(t.copyCard&&cs.length==2){const src=cs[0],dst=cs[1];dst.enh=src.enh;dst.seal=src.seal;G.mods[dst.id]={...(G.mods[dst.id]||{}),enh:dst.enh,seal:dst.seal}}else cs.forEach(c=>{if(t.kill){G.dead.add(c.id);G.hand.splice(G.hand.indexOf(c),1)}else{const m=G.mods[c.id]=G.mods[c.id]||{};if(t.s!=null)m.s=c.s=t.s;if(t.enh)m.enh=c.enh=t.enh;if(t.up)m.r=c.r=Math.min(14,c.r+1);if(t.seal)m.seal=c.seal=t.seal}});G.sel=new Set()}
 G.cons.splice(i,1);G.msg=t.n+'!';if(G.hand.length<G.hs)draw();render()}
function bind(){
 const on=(s,f)=>{const e=$(s);if(e)e.onclick=f};
 on('#go',startBlind);on('#play',play);on('#disc',discard);on('#shop',openShop);on('#rr',reroll);on('#next',nextBlind);on('#again',newGame);
 on('#sr',()=>{sortHand('r');render()});on('#ss',()=>{sortHand('s');render()});on('#help',()=>help(0));
 document.querySelectorAll('.card').forEach(e=>{e.onclick=()=>toggle(+e.dataset.id);e.onkeydown=k=>{if(k.key==' '||k.key=='Enter'){k.preventDefault();toggle(+e.dataset.id)}}});
 document.querySelectorAll('[data-buy]').forEach(e=>e.onclick=()=>buyJ(+e.dataset.buy));
 document.querySelectorAll('[data-sell]').forEach(e=>e.onclick=()=>sell(+e.dataset.sell));
 document.querySelectorAll('[data-jleft]').forEach(e=>e.onclick=()=>moveJoker(+e.dataset.jleft,-1));
 document.querySelectorAll('[data-jright]').forEach(e=>e.onclick=()=>moveJoker(+e.dataset.jright,1));
 document.querySelectorAll('[data-pl]').forEach(e=>e.onclick=()=>buyP(+e.dataset.pl));
 document.querySelectorAll('[data-dk]').forEach(e=>e.onclick=()=>{G.dk=DECKS[+e.dataset.dk];G.money+=G.dk.money||0;G.slots=5+(G.dk.slots||0);G.consMax+=G.dk.cons||0;(G.dk.lvUp||[]).forEach(k=>G.lv[k]++);G.phase='blind';render()});
 document.querySelectorAll('[data-ta]').forEach(e=>e.onclick=()=>{const cost=price(3);if(G.money<cost||G.cons.length>=G.consMax)return;G.money-=cost;G.cons.push(G.tarots.splice(+e.dataset.ta,1)[0]);render()});
 document.querySelectorAll('[data-vo]').forEach(e=>e.onclick=()=>{const cost=price(10);if(G.money<cost)return;G.money-=cost;G.vo[G.voc.k]=G.voc.v||1;if(G.voc.k=='cons')G.consMax++;if(G.voc.k=='jslot')G.slots++;G.voc=null;render()});
 document.querySelectorAll('[data-use]').forEach(e=>e.onclick=()=>useT(+e.dataset.use));
 on('#mute',()=>{mute=!mute;render()});on('#lang',()=>setLanguage(currentLang=='en'?'vi':'en'));on('#stk',()=>{G.stake=G.stake%4+1;render()});on('#col',col);on('#skip',skipB);on('#resume',()=>{if(load())render()});on('#endless',()=>{G.endless=true;nextBlind()});on('#pskip',()=>{G.open=null;G.phase='shop';render()});
 document.querySelectorAll('[data-pk]').forEach(e=>e.onclick=()=>buyPk(+e.dataset.pk));
 document.querySelectorAll('[data-pp]').forEach(e=>e.onclick=()=>pickPk(+e.dataset.pp));
}
const PAGES=[
 ['Mục tiêu','Mỗi vòng có một <b>điểm mục tiêu</b>. Bạn phải đạt đủ điểm trước khi hết lượt đánh. Mỗi ante có 3 vòng (nhỏ, lớn, trùm); qua hết <b>8 ante</b> là thắng.'],
 ['Đánh và xả bài','Bạn cầm 8 lá. Bấm để chọn tối đa <b>5 lá</b> rồi bấm <b>Đánh bài</b> để ghi điểm, hoặc <b>Xả bài</b> để đổi lá lấy bài mới (số lượt xả có hạn). Các lá đã đánh hoặc xả sẽ không quay lại trong vòng đó.'],
 ['Cách tính điểm','Điểm = <b>Chips × Mult</b>. Mỗi tổ hợp có Chips và Mult gốc. Chỉ những lá tạo nên tổ hợp mới ghi điểm và cộng thêm Chips theo mặt bài (2–10 theo số, J/Q/K = 10, Át = 11). Ví dụ một Đôi chỉ tính hai lá của đôi đó.'],
 ['Joker','Joker là lá đặc biệt đặt ngoài bàn (tối đa 5). Mỗi Joker cho hiệu ứng riêng: cộng Mult, cộng Chips, hoặc nhân Mult. Joker phát huy theo thứ tự từ trái sang phải. Ghép các Joker ăn ý với nhau là chìa khóa để lên điểm lớn.'],
 ['Tiền và cửa hàng','Qua vòng bạn nhận tiền thưởng, $1 cho mỗi lượt đánh còn dư, và lãi $1 cho mỗi $5 đang giữ (tối đa $5). Ở cửa hàng, mua Joker hoặc thẻ Hành tinh (nâng cấp một loại tổ hợp), làm mới hàng hoặc bán Joker lấy một nửa giá.'],
 ['Tarot, voucher, trùm','Tarot (tối đa 2) dùng khi đang chơi: chọn lá rồi bấm nút Tarot để đổi chất, thêm Chips/Mult vĩnh viễn hoặc xóa lá khỏi bộ bài. Voucher nâng cấp vĩnh viễn. Mỗi trùm có một hiệu ứng riêng, xem ở màn chọn vòng.'],
 ['Gói, vô hạn','Gói ($4) cho chọn 1 trong 3 thẻ. Thắng ante 8 xong bạn có thể chơi vô hạn. Tắt âm thanh bằng nút ở thanh bên. Bỏ qua vòng nhỏ hoặc vòng lớn để nhận Tag. Joker có thể mang Edition (Foil +50 Chips, Holo +10 Mult, Poly ×1,5 Mult). Độ khó 2–4 tăng mục tiêu thêm 25% mỗi bậc, từ độ 3 còn ít hơn 1 lượt xả và từ độ 4 cửa hàng đắt hơn $1. Phím tắt: 1–9 chọn lá, P đánh, D xả. Game tự lưu ở màn chọn vòng; bấm "Tiếp tục" ở màn chọn bộ bài để chơi tiếp. Gói Spectral có Dấu vàng/xanh/tím, Thép (×1,5 Mult khi giữ trên tay), Hố đen... Enhancement, Seal và Joker synergy được giữ lại qua bộ bài. Voucher kinh tế có thể giảm giá, tăng giới hạn lãi hoặc cho reroll miễn phí.']
];
const PAGES_EN=[
 ['Goal','Each round has a target score. Reach it before you run out of hands. Each ante has 3 blinds; clear all 8 antes to win.'],
 ['Play and discard','You start with 8 cards. Select up to 5 cards and press Play hand to score, or Discard to draw replacements. Played and discarded cards do not return during that round.'],
 ['Scoring','Score = Chips × Mult. Each hand has base Chips and Mult. Only cards contributing to the hand score, then add their rank Chips.'],
 ['Jokers','Jokers are special cards placed outside the hand (up to 5). They add Chips, Mult, or multipliers and trigger from left to right.'],
 ['Money and shop','Win rewards after each blind, plus $1 for every unused hand and interest on saved money. Buy Jokers, upgrade hands with Planets, reroll, or sell Jokers.'],
 ['Tarot, vouchers, bosses','Use Tarot and Spectral cards while playing. Vouchers provide permanent upgrades. Each Boss has a unique rule shown on the blind screen.'],
 ['Packs and endless mode','Packs offer cards to choose from. After clearing ante 8 you can continue endlessly. Use the language button to switch between English and Vietnamese.']
];
function help(p){
 const pages=currentLang=='en'?PAGES_EN:PAGES;
 const last=p>=PAGES.length;
 let body;
 if(last){
  body=`<h2>${currentLang=='en'?'Hand table':'Bảng tổ hợp'}</h2><table><tr><th>${currentLang=='en'?'Hand':'Tổ hợp'}</th><th>Chips</th><th>Mult</th><th>${TEXT[currentLang].level}</th></tr>${HAND_KEYS.map(t=>{const[c,m]=G?lvStats(t):[HT[t][1],HT[t][2]];return`<tr><td>${handLabel(t)}</td><td>${c}</td><td>${m}</td><td>${G?G.lv[t]:1}</td></tr>`}).join('')}</table><p>${currentLang=='en'?'Each upgrade increases the hand Chips and Mult.':'Mỗi lần nâng cấp, Chips và Mult của tổ hợp tăng thêm.'}</p>`;
 }else body=`<h2>${pages[p][0]}</h2><p>${pages[p][1]}</p>`;
 $('#modal').innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="mb">${body}<div class="row" style="margin-top:12px">${p>0?`<button class="b-grey" id="hp">${tr('Back')}</button>`:''}<button class="b-blue" id="hn">${last?tr('Close'):tr('Next')}</button><button class="b-grey" id="hx">${tr('Skip guide')}</button></div><div style="text-align:center;opacity:.6;font-size:.8rem;margin-top:6px">${Math.min(p+1,PAGES.length+1)}/${PAGES.length+1}</div></div></div>`;
 $('#hn').onclick=()=>last?($('#modal').innerHTML=''):help(p+1);
 $('#hx').onclick=()=>$('#modal').innerHTML='';
 if($('#hp'))$('#hp').onclick=()=>help(p-1);
 $('#hn').focus();
}
document.addEventListener('keydown',e=>{if(e.key=='Escape')$('#modal').innerHTML=''});
document.addEventListener('keydown',e=>{if(G.phase!='play'||$('#modal').innerHTML||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(k>='1'&&k<='9'){const c=G.hand[+k-1];if(c)toggle(c.id)}else if(k=='p')play();else if(k=='d')discard()});
let bi=0;setInterval(()=>{if(mute||!ac)return;snd([110,138,165,138][bi++%4],.5,'triangle')},600);
loadTranslations().finally(()=>{initLanguage();newGame();help(0)});
