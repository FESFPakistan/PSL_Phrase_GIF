// PSL (Pakistan Sign Language) Video Dictionary
// ---------------------------------------------------------------------------
// Each entry must use the SIMPLEST / BASE form of the word.
//   baseWord : singular noun or verb infinitive, lowercase
//   videoUrl : path to the GIF / video file relative to index.html
//              (follows the original convention: gifs/<word>_onlysign.gif)
//   aliases  : synonyms, Urdu transliterations, or common alternate spellings
//              that should also resolve to this sign
// ---------------------------------------------------------------------------
// Replace videoUrl values with your actual file paths once GIFs/videos are
// available. Placeholder paths use the original naming convention so existing
// gifs/ folder entries continue to work automatically.
// ---------------------------------------------------------------------------

var WORD_DICTIONARY = [

  // ── Greetings & Courtesies ───────────────────────────────────────────────
  { baseWord: "hello",      videoUrl: "gifs/hello_onlysign.gif",      aliases: ["hi", "hey", "greet", "greeting"] },
  { baseWord: "goodbye",    videoUrl: "gifs/goodbye_onlysign.gif",    aliases: ["bye", "farewell", "see you", "later"] },
  { baseWord: "thank",      videoUrl: "gifs/thank_onlysign.gif",      aliases: ["thanks", "thank you", "grateful", "appreciate", "shukriya"] },
  { baseWord: "please",     videoUrl: "gifs/please_onlysign.gif",     aliases: ["kindly", "request", "meherbani"] },
  { baseWord: "sorry",      videoUrl: "gifs/sorry_onlysign.gif",      aliases: ["apologize", "apology", "excuse me", "forgive", "maaf"] },
  { baseWord: "welcome",    videoUrl: "gifs/welcome_onlysign.gif",    aliases: ["come in", "khush aamdeed"] },

  // ── Basic Responses ──────────────────────────────────────────────────────
  { baseWord: "yes",        videoUrl: "gifs/yes_onlysign.gif",        aliases: ["okay", "ok", "correct", "right", "agree", "sure", "haan", "ji"] },
  { baseWord: "no",         videoUrl: "gifs/no_onlysign.gif",         aliases: ["nope", "negative", "refuse", "nahi"] },
  { baseWord: "maybe",      videoUrl: "gifs/maybe_onlysign.gif",      aliases: ["perhaps", "possibly", "shayad"] },

  // ── Core Verbs ───────────────────────────────────────────────────────────
  { baseWord: "help",       videoUrl: "gifs/help_onlysign.gif",       aliases: ["assist", "support", "aid", "madad"] },
  { baseWord: "eat",        videoUrl: "gifs/eat_onlysign.gif",        aliases: ["food", "meal", "hungry", "hunger", "lunch", "dinner", "breakfast", "khana"] },
  { baseWord: "drink",      videoUrl: "gifs/drink_onlysign.gif",      aliases: ["water", "thirsty", "thirst", "beverage", "pani"] },
  { baseWord: "go",         videoUrl: "gifs/go_onlysign.gif",         aliases: ["leave", "depart", "move", "jana"] },
  { baseWord: "come",       videoUrl: "gifs/come_onlysign.gif",       aliases: ["arrive", "approach", "enter", "aana"] },
  { baseWord: "work",       videoUrl: "gifs/work_onlysign.gif",       aliases: ["job", "employ", "office", "kaam"] },
  { baseWord: "play",       videoUrl: "gifs/play_onlysign.gif",       aliases: ["game", "sport", "fun", "khel"] },
  { baseWord: "study",      videoUrl: "gifs/study_onlysign.gif",      aliases: ["learn", "education", "class", "lesson", "parhna"] },
  { baseWord: "give",       videoUrl: "gifs/give_onlysign.gif",       aliases: ["offer", "provide", "share", "donate", "dena"] },
  { baseWord: "take",       videoUrl: "gifs/take_onlysign.gif",       aliases: ["grab", "get", "receive", "fetch", "lena"] },
  { baseWord: "see",        videoUrl: "gifs/see_onlysign.gif",        aliases: ["look", "watch", "view", "observe", "dekhna"] },
  { baseWord: "hear",       videoUrl: "gifs/hear_onlysign.gif",       aliases: ["listen", "sound", "sunna"] },
  { baseWord: "speak",      videoUrl: "gifs/speak_onlysign.gif",      aliases: ["talk", "say", "tell", "sign", "communicate", "bolna"] },
  { baseWord: "write",      videoUrl: "gifs/write_onlysign.gif",      aliases: ["pen", "note", "type", "likhna"] },
  { baseWord: "read",       videoUrl: "gifs/read_onlysign.gif",       aliases: ["book", "text", "parhna"] },
  { baseWord: "run",        videoUrl: "gifs/run_onlysign.gif",        aliases: ["jog", "sprint", "rush", "bhagna"] },
  { baseWord: "walk",       videoUrl: "gifs/walk_onlysign.gif",       aliases: ["stroll", "step", "chalna"] },
  { baseWord: "sit",        videoUrl: "gifs/sit_onlysign.gif",        aliases: ["seat", "chair", "baithna"] },
  { baseWord: "stand",      videoUrl: "gifs/stand_onlysign.gif",      aliases: ["rise", "up", "khara"] },
  { baseWord: "sleep",      videoUrl: "gifs/sleep_onlysign.gif",      aliases: ["rest", "tired", "nap", "sona"] },
  { baseWord: "wake",       videoUrl: "gifs/wake_onlysign.gif",       aliases: ["morning", "awake", "uthna"] },
  { baseWord: "want",       videoUrl: "gifs/want_onlysign.gif",       aliases: ["need", "wish", "desire", "require", "chahna"] },
  { baseWord: "like",       videoUrl: "gifs/like_onlysign.gif",       aliases: ["love", "prefer", "enjoy", "favourite", "pasand"] },
  { baseWord: "know",       videoUrl: "gifs/know_onlysign.gif",       aliases: ["understand", "realize", "aware", "jaanna"] },
  { baseWord: "think",      videoUrl: "gifs/think_onlysign.gif",      aliases: ["believe", "guess", "mind", "sochna"] },
  { baseWord: "understand", videoUrl: "gifs/understand_onlysign.gif", aliases: ["comprehend", "grasp", "follow", "samajhna"] },
  { baseWord: "forget",     videoUrl: "gifs/forget_onlysign.gif",     aliases: ["miss", "bhool"] },
  { baseWord: "remember",   videoUrl: "gifs/remember_onlysign.gif",   aliases: ["recall", "memory", "yaad"] },
  { baseWord: "wait",       videoUrl: "gifs/wait_onlysign.gif",       aliases: ["pause", "hold", "stop", "rukna"] },
  { baseWord: "buy",        videoUrl: "gifs/buy_onlysign.gif",        aliases: ["purchase", "shop", "pay", "kharidna"] },
  { baseWord: "open",       videoUrl: "gifs/open_onlysign.gif",       aliases: ["unlock", "kholna"] },
  { baseWord: "close",      videoUrl: "gifs/close_onlysign.gif",      aliases: ["shut", "lock", "band"] },
  { baseWord: "wash",       videoUrl: "gifs/wash_onlysign.gif",       aliases: ["clean", "bath", "shower", "dhona"] },
  { baseWord: "call",       videoUrl: "gifs/call_onlysign.gif",       aliases: ["phone", "ring", "contact", "bulana"] },
  { baseWord: "show",       videoUrl: "gifs/show_onlysign.gif",       aliases: ["display", "present", "dikhana"] },
  { baseWord: "ask",        videoUrl: "gifs/ask_onlysign.gif",        aliases: ["question", "query", "poochna"] },
  { baseWord: "answer",     videoUrl: "gifs/answer_onlysign.gif",     aliases: ["reply", "respond", "jawab"] },
  { baseWord: "bring",      videoUrl: "gifs/bring_onlysign.gif",      aliases: ["carry", "fetch", "lana"] },
  { baseWord: "put",        videoUrl: "gifs/put_onlysign.gif",        aliases: ["place", "keep", "set", "rakhna"] },
  { baseWord: "make",       videoUrl: "gifs/make_onlysign.gif",       aliases: ["create", "build", "banana"] },
  { baseWord: "use",        videoUrl: "gifs/use_onlysign.gif",        aliases: ["utilize", "apply", "istemaal"] },
  { baseWord: "finish",     videoUrl: "gifs/finish_onlysign.gif",     aliases: ["done", "complete", "end", "khatam"] },
  { baseWord: "start",      videoUrl: "gifs/start_onlysign.gif",      aliases: ["begin", "initiate", "shuru"] },
  { baseWord: "stop",       videoUrl: "gifs/stop_onlysign.gif",       aliases: ["halt", "quit", "ruko"] },
  { baseWord: "change",     videoUrl: "gifs/change_onlysign.gif",     aliases: ["switch", "alter", "badalna"] },
  { baseWord: "find",       videoUrl: "gifs/find_onlysign.gif",       aliases: ["search", "locate", "dhundhna"] },
  { baseWord: "lose",       videoUrl: "gifs/lose_onlysign.gif",       aliases: ["miss", "kho"] },

  // ── People & Relationships ────────────────────────────────────────────────
  { baseWord: "mother",     videoUrl: "gifs/mother_onlysign.gif",     aliases: ["mom", "mama", "mum", "mummy", "ammi", "amma"] },
  { baseWord: "father",     videoUrl: "gifs/father_onlysign.gif",     aliases: ["dad", "papa", "daddy", "abbu", "abba"] },
  { baseWord: "brother",    videoUrl: "gifs/brother_onlysign.gif",    aliases: ["bhai"] },
  { baseWord: "sister",     videoUrl: "gifs/sister_onlysign.gif",     aliases: ["behan"] },
  { baseWord: "child",      videoUrl: "gifs/child_onlysign.gif",      aliases: ["kid", "baby", "infant", "bacha"] },
  { baseWord: "boy",        videoUrl: "gifs/boy_onlysign.gif",        aliases: ["son", "larka"] },
  { baseWord: "girl",       videoUrl: "gifs/girl_onlysign.gif",       aliases: ["daughter", "larki"] },
  { baseWord: "man",        videoUrl: "gifs/man_onlysign.gif",        aliases: ["male", "gentleman", "mard", "aadmi"] },
  { baseWord: "woman",      videoUrl: "gifs/woman_onlysign.gif",      aliases: ["female", "lady", "aurat", "khaatoon"] },
  { baseWord: "friend",     videoUrl: "gifs/friend_onlysign.gif",     aliases: ["buddy", "pal", "companion", "dost"] },
  { baseWord: "teacher",    videoUrl: "gifs/teacher_onlysign.gif",    aliases: ["instructor", "professor", "ustad", "sir"] },
  { baseWord: "student",    videoUrl: "gifs/student_onlysign.gif",    aliases: ["pupil", "learner", "talib"] },
  { baseWord: "doctor",     videoUrl: "gifs/doctor_onlysign.gif",     aliases: ["physician", "medical", "hakeem", "tabib"] },

  // ── Places ───────────────────────────────────────────────────────────────
  { baseWord: "house",      videoUrl: "gifs/house_onlysign.gif",      aliases: ["home", "building", "ghar"] },
  { baseWord: "school",     videoUrl: "gifs/school_onlysign.gif",     aliases: ["college", "university", "madrasa", "school"] },
  { baseWord: "hospital",   videoUrl: "gifs/hospital_onlysign.gif",   aliases: ["clinic", "sick", "shifakhana"] },
  { baseWord: "mosque",     videoUrl: "gifs/mosque_onlysign.gif",     aliases: ["masjid", "prayer", "namaz"] },
  { baseWord: "market",     videoUrl: "gifs/market_onlysign.gif",     aliases: ["shop", "bazaar", "store", "mall", "bazar"] },
  { baseWord: "Pakistan",   videoUrl: "gifs/Pakistan_onlysign.gif",   aliases: ["pak", "country", "mulk"] },
  { baseWord: "Karachi",    videoUrl: "gifs/Karachi_onlysign.gif",    aliases: [] },
  { baseWord: "Lahore",     videoUrl: "gifs/Lahore_onlysign.gif",     aliases: [] },
  { baseWord: "Islamabad",  videoUrl: "gifs/Islamabad_onlysign.gif",  aliases: ["capital", "capital city"] },

  // ── Objects ───────────────────────────────────────────────────────────────
  { baseWord: "book",       videoUrl: "gifs/book_onlysign.gif",       aliases: ["novel", "kitab"] },
  { baseWord: "computer",   videoUrl: "gifs/computer_onlysign.gif",   aliases: ["laptop", "pc", "technology", "computer"] },
  { baseWord: "phone",      videoUrl: "gifs/phone_onlysign.gif",      aliases: ["mobile", "cell", "mobile phone"] },
  { baseWord: "car",        videoUrl: "gifs/car_onlysign.gif",        aliases: ["vehicle", "drive", "taxi", "gaari"] },
  { baseWord: "bus",        videoUrl: "gifs/bus_onlysign.gif",        aliases: ["transport", "travel"] },
  { baseWord: "money",      videoUrl: "gifs/money_onlysign.gif",      aliases: ["rupee", "currency", "paisay", "cash"] },
  { baseWord: "food",       videoUrl: "gifs/food_onlysign.gif",       aliases: ["meal", "dish", "khana"] },
  { baseWord: "water",      videoUrl: "gifs/water_onlysign.gif",      aliases: ["drink", "pani", "paani"] },
  { baseWord: "chair",      videoUrl: "gifs/chair_onlysign.gif",      aliases: ["seat", "kursi"] },
  { baseWord: "table",      videoUrl: "gifs/table_onlysign.gif",      aliases: ["desk", "mez"] },

  // ── Descriptors / Adjectives ─────────────────────────────────────────────
  { baseWord: "good",       videoUrl: "gifs/good_onlysign.gif",       aliases: ["great", "excellent", "nice", "fine", "acha", "theek"] },
  { baseWord: "bad",        videoUrl: "gifs/bad_onlysign.gif",        aliases: ["terrible", "awful", "bura", "kharab"] },
  { baseWord: "big",        videoUrl: "gifs/big_onlysign.gif",        aliases: ["large", "huge", "tall", "bada"] },
  { baseWord: "small",      videoUrl: "gifs/small_onlysign.gif",      aliases: ["little", "tiny", "short", "chota"] },
  { baseWord: "hot",        videoUrl: "gifs/hot_onlysign.gif",        aliases: ["warm", "heat", "garam"] },
  { baseWord: "cold",       videoUrl: "gifs/cold_onlysign.gif",       aliases: ["cool", "chill", "winter", "thanda"] },
  { baseWord: "happy",      videoUrl: "gifs/happy_onlysign.gif",      aliases: ["joy", "glad", "smile", "laugh", "khush"] },
  { baseWord: "sad",        videoUrl: "gifs/sad_onlysign.gif",        aliases: ["cry", "upset", "unhappy", "udaas"] },
  { baseWord: "fast",       videoUrl: "gifs/fast_onlysign.gif",       aliases: ["quick", "speed", "tez"] },
  { baseWord: "slow",       videoUrl: "gifs/slow_onlysign.gif",       aliases: ["gradual", "dheeray", "aahista"] },
  { baseWord: "new",        videoUrl: "gifs/new_onlysign.gif",        aliases: ["fresh", "naya"] },
  { baseWord: "old",        videoUrl: "gifs/old_onlysign.gif",        aliases: ["ancient", "purana", "buda"] },
  { baseWord: "sick",       videoUrl: "gifs/sick_onlysign.gif",       aliases: ["ill", "unwell", "beemar"] },
  { baseWord: "healthy",    videoUrl: "gifs/healthy_onlysign.gif",    aliases: ["fit", "well", "sehatmand"] },
  { baseWord: "deaf",       videoUrl: "gifs/deaf_onlysign.gif",       aliases: ["hearing impaired", "behra"] },

  // ── Numbers ───────────────────────────────────────────────────────────────
  { baseWord: "one",        videoUrl: "gifs/one_onlysign.gif",        aliases: ["1", "first", "aik"] },
  { baseWord: "two",        videoUrl: "gifs/two_onlysign.gif",        aliases: ["2", "second", "do"] },
  { baseWord: "three",      videoUrl: "gifs/three_onlysign.gif",      aliases: ["3", "third", "teen"] },
  { baseWord: "four",       videoUrl: "gifs/four_onlysign.gif",       aliases: ["4", "fourth", "char"] },
  { baseWord: "five",       videoUrl: "gifs/five_onlysign.gif",       aliases: ["5", "fifth", "paanch"] },
  { baseWord: "ten",        videoUrl: "gifs/ten_onlysign.gif",        aliases: ["10", "das"] },
  { baseWord: "hundred",    videoUrl: "gifs/hundred_onlysign.gif",    aliases: ["100", "sao"] },

  // ── Question Words ────────────────────────────────────────────────────────
  { baseWord: "what",       videoUrl: "gifs/what_onlysign.gif",       aliases: ["which", "kya"] },
  { baseWord: "who",        videoUrl: "gifs/who_onlysign.gif",        aliases: ["kaun"] },
  { baseWord: "where",      videoUrl: "gifs/where_onlysign.gif",      aliases: ["location", "place", "kahan"] },
  { baseWord: "when",       videoUrl: "gifs/when_onlysign.gif",       aliases: ["time", "kab"] },
  { baseWord: "how",        videoUrl: "gifs/how_onlysign.gif",        aliases: ["manner", "kaisay", "kaise"] },
  { baseWord: "why",        videoUrl: "gifs/why_onlysign.gif",        aliases: ["reason", "cause", "kyun", "kiyun"] },

  // ── Time ─────────────────────────────────────────────────────────────────
  { baseWord: "today",      videoUrl: "gifs/today_onlysign.gif",      aliases: ["now", "aaj"] },
  { baseWord: "tomorrow",   videoUrl: "gifs/tomorrow_onlysign.gif",   aliases: ["next day", "kal"] },
  { baseWord: "yesterday",  videoUrl: "gifs/yesterday_onlysign.gif",  aliases: ["past", "kal"] },
  { baseWord: "day",        videoUrl: "gifs/day_onlysign.gif",        aliases: ["date", "din"] },
  { baseWord: "week",       videoUrl: "gifs/week_onlysign.gif",       aliases: ["hafta"] },
  { baseWord: "month",      videoUrl: "gifs/month_onlysign.gif",      aliases: ["mahina"] },
  { baseWord: "year",       videoUrl: "gifs/year_onlysign.gif",       aliases: ["saal"] },
  { baseWord: "morning",    videoUrl: "gifs/morning_onlysign.gif",    aliases: ["subah"] },
  { baseWord: "evening",    videoUrl: "gifs/evening_onlysign.gif",    aliases: ["shaam"] },
  { baseWord: "night",      videoUrl: "gifs/night_onlysign.gif",      aliases: ["raat"] },

  // ── Colors ────────────────────────────────────────────────────────────────
  { baseWord: "color",      videoUrl: "gifs/color_onlysign.gif",      aliases: ["colour", "rang"] },
  { baseWord: "red",        videoUrl: "gifs/red_onlysign.gif",        aliases: ["lal"] },
  { baseWord: "blue",       videoUrl: "gifs/blue_onlysign.gif",       aliases: ["neela"] },
  { baseWord: "green",      videoUrl: "gifs/green_onlysign.gif",      aliases: ["sabz"] },
  { baseWord: "white",      videoUrl: "gifs/white_onlysign.gif",      aliases: ["safed"] },
  { baseWord: "black",      videoUrl: "gifs/black_onlysign.gif",      aliases: ["kaala"] },
  { baseWord: "yellow",     videoUrl: "gifs/yellow_onlysign.gif",     aliases: ["peela"] },

];
