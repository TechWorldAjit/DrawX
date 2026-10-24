// 20 Structured Categories containing over 1,000 distinct, drawable objects

const BUILT_IN_CATEGORIES = [
  {
    id: 'household',
    name: 'Everyday Household Objects',
    description: 'Familiar household essentials and decor items',
    subjects: [
      'Water bottle', 'Wall clock', 'Keychain with keys', 'Desk lamp', 'Pocket umbrella',
      'Ceramic mug', 'Glass vase', 'Scented candle in jar', 'Picture frame', 'Door padlock',
      'Ceiling fan blade', 'Flashlight', 'Compact mirror', 'Floor standing fan', 'Curtain tassel',
      'Shoehorn', 'Doorknob with keyhole', 'Decorative bowl', 'Clothes hanger', 'Table coaster',
      'Tissue box', 'Doorstop wedge', 'Incense holder', 'Window latch', 'Wall thermometer',
      'Alarm clock bell', 'Jewelry box', 'Eyeglass case', 'Lint roller', 'Matches in matchbox',
      'Thermos flask', 'Safety pin', 'Clothes peg', 'Shoe brush', 'Keycard holder',
      'Lighter', 'Cushion with piping', 'Light bulb', 'Extension cord reel', 'Wall calendar',
      'Door bell chime', 'Handheld magnifying glass', 'Bookend', 'Coat hook', 'Drawer handle',
      'Luggage tag', 'Padlock with dial', 'Nightlight plug', 'Hourglass timer', 'Bottle opener keychain',
      'Umbrella stand', 'Coin piggy bank', 'Wall mirror with frame', 'Letter opener', 'Door knocker'
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen Utensils and Appliances',
    description: 'Culinary tools, cookware, and kitchen appliances',
    subjects: [
      'Electric kettle', 'Toaster with bread', 'Stainless steel fork', 'Soup ladle', 'Chef knife',
      'Wooden cutting board', 'Rolling pin', 'Wire whisk', 'Non-stick frying pan', 'Cast iron skillet',
      'Measuring cup', 'Measuring spoons', 'Tea strainer', 'French press', 'Blender jar',
      'Manual can opener', 'Garlic press', 'Cheese grater', 'Colander strainer', 'Coffee grinder',
      'Pepper mill grinder', 'Salt shaker', 'Salad tongs', 'Silicone spatula', 'Slotted spoon',
      'Corkscrew bottle opener', 'Mortar and pestle', 'Baking tray', 'Muffin tin', 'Saucepan with lid',
      'Pressure cooker', 'Egg slicer', 'Peeler for vegetables', 'Apple corer', 'Kitchen timer',
      'Pestle', 'Nutcracker', 'Waffle iron', 'Juice extractor', 'Immersion hand blender',
      'Fondue pot with fork', 'Ice cream scoop', 'Bread basket', 'Oil dispenser bottle', 'Oven mitt',
      'Sauce boat', 'Butter dish with cover', 'Gravy ladle', 'Water pitcher', 'Wine goblet',
      'Chopsticks with rest', 'Cake stand with dome', 'Teapot with spout', 'Coffee percolator', 'Bento lunchbox'
    ]
  },
  {
    id: 'stationery',
    name: 'Study Stationery and School Supplies',
    description: 'Writing instruments, drawing tools, and school desk supplies',
    subjects: [
      'Graphite pencil', 'Wooden pencil with eraser', 'Pink rubber eraser', 'Kneaded eraser',
      'Double-hole pencil sharpener', 'Ballpoint pen', 'Fountain pen with nib', 'Gel ink pen',
      'Permanent marker', 'Chisel-tip highlighter', 'Clear plastic ruler', 'Wooden triangular ruler',
      'Drawing compass with needle', 'Protractor for angles', 'Glue stick', 'Liquid white glue bottle',
      'Scissors with blunt tip', 'Mini desk stapler', 'Staple remover claw', 'Box of paperclips',
      'Colored push pins', 'Binder bulldog clip', 'Post-it sticky note pad', 'Lined spiral notebook',
      'Hardcover sketchbook', 'Watercolor paint tube', 'Artist paint palette', 'Round synthetic brush',
      'Flat bristle brush', 'Palette knife', 'Crayon stick', 'Oil pastel stick', 'Charcoal drawing stick',
      'Pencil extender', 'Drawing clip on board', 'Mechanical pencil', 'Mechanical pencil lead tube',
      'Correction tape dispenser', 'Index card divider', 'Pencil case pouch', 'Geometry stencil plate',
      'Tracing paper roll', 'Paper guillotine cutter', 'Eraser shield', 'Calligraphy dip pen',
      'Color pencil set', 'Highlighter marker duo', 'Rubber ink stamp', 'Ink pad container', 'Desk pencil pot'
    ]
  },
  {
    id: 'office',
    name: 'Office Supplies',
    description: 'Workplace desk accessories, filing gear, and presentation equipment',
    subjects: [
      'Heavy-duty 2-hole punch', 'Document tray tier', 'Desktop tape dispenser', 'Rolodex card spinner',
      'Acrylic business card holder', 'Calculator with solar panel', 'Laminating pouch', 'Filing accordion folder',
      'Clipboard with metal clamp', 'Manila file folder with tab', 'Desk nameplate holder', 'Retractable badge reel',
      'Paper shredder bin', 'Wireless presentation clicker', 'Dry erase white board marker', 'Felt whiteboard eraser',
      'Mesh wire pen stand', 'Paperweight stone', 'Desk organizer carousel', 'Cash counting envelope',
      'Date stamp with wheel', 'Wax seal stamp', 'Receipt spike spindle', 'Rubber band ball',
      'Plastic document sleeve', 'Expanding file wallet', 'Desk desk-pad mat', 'Filing cabinet label tag',
      'Correction fluid bottle', 'Finger moistener pad', 'Thumb tack box', 'Document clip clamp',
      'Sticky tab index flags', 'Paper fastener brad', 'Badge lanyard strap', 'Desk letter rack',
      'Tape runner dispenser', 'Card reader swipe slot', 'Counter bell ringer', 'Desktop clock radio',
      'Rotary paper trimmer', 'Bookbinding comb spine', 'Catalog binder ring', 'Desk blotter pad', 'Ledger notebook',
      'Self-inking address stamp', 'Magnifying sheet reader', 'Metal waste paper basket', 'Desk calendar stand', 'Plastic ruler with handle'
    ]
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Seating, tables, storage, and accent furniture',
    subjects: [
      'Wooden dining chair', 'Swivel office chair with armrests', 'Three-legged wooden stool',
      'Bar stool with round seat', 'Armchair with cushions', 'Rocking chair with curved runner',
      'Recliner chair with footrest', 'Two-seater sofa couch', 'Chaise lounge daybed', 'Square coffee table',
      'Round pedestal dining table', 'Bedside nightstand with drawer', 'Minimalist study writing desk',
      'Executive desk with drawers', 'Five-tier ladder bookshelf', 'Wall-mounted floating shelf',
      'Four-drawer bedroom dresser', 'Standing wooden coat rack', 'Folding metal chair', 'Folding camping table',
      'Platform bed frame', 'Bed headboard with upholstery', 'Standing full-length mirror', 'Vanity table with mirror',
      'Storage ottoman pouf', 'Shoe rack bench', 'Display curio cabinet', 'Wine bottle storage rack',
      'Corner bookcase unit', 'Kitchen utility island cart', 'Bench with slatted wood', 'Hammock with wooden spreader',
      'Bean bag lounge seat', 'Stepladder stool with folding steps', 'Side table with metal hairpin legs',
      'Nesting tables set of two', 'Wardrobe cabinet with handles', 'Console table for entryway',
      'Filing drawer cabinet unit', 'Magazine storage rack', 'Drafting table with tilting top',
      'Rocking crib cradle', 'TV media console unit', 'Pantry storage shelving', 'Plant stand pedestal',
      'Secretary desk with foldout flap', 'Futon convertible frame', 'Room divider folding screen', 'Hall tree bench with hooks', 'Porch swing with chains'
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics and Accessories',
    description: 'Personal tech, gadgets, cables, and electronic devices',
    subjects: [
      'Over-ear noise cancelling headphones', 'In-ear wired earphones', 'Wireless earbuds charging case',
      'Smartphone with camera lens', 'Tablet device with stylus pen', 'Laptop with keyboard and trackpad',
      'Computer optical mouse', 'Mechanical keyboard with keycaps', 'USB flash thumb drive', 'Portable external hard drive',
      'USB-C wall charger adapter', 'Braided phone charging cable', 'Slim portable power bank', 'Compact Bluetooth speaker',
      'Smartwatch with silicon strap', 'DSLR digital camera body', 'Camera zoom lens cylinder', 'Lens hood ring',
      'Camera tripod with ball head', 'Television remote control with buttons', 'Game console gamepad controller',
      'Retro pocket gaming console', 'Desktop microphone with stand', 'Pop filter mesh for mic', 'Webcam with monitor clip',
      'Wireless internet router with antennas', 'Wi-Fi mesh node tower', 'Surge protector power strip',
      'HDMI cable with connectors', 'SD memory card with pins', 'Digital voice recorder dictaphone',
      'Electronic drawing tablet stylus', 'E-reader screen with bezel', 'Action camera in waterproof case',
      'Camera neck strap', 'Headphone desk hanger stand', 'Multi-port USB hub adapter', 'Wireless phone charging pad',
      'Selfie stick with mount', 'Gimbal smartphone stabilizer', 'Car dashboard phone suction mount',
      'Mini audio amplifier box', 'Cable management clip organizer', 'LED ring light with stand',
      'Computer monitor on stand', 'Smart speaker round puck', 'Audio auxiliary audio jack adapter',
      'Flash unit for camera hotshoe', 'Drone quadcopter with propellers', 'Earphone silicone tip case'
    ]
  },
  {
    id: 'tools',
    name: 'Tools and Hardware',
    description: 'Hand tools, workshop equipment, and fastener hardware',
    subjects: [
      'Claw hammer with wooden handle', 'Ball-peen hammer', 'Rubber mallet head', 'Cross-head screwdriver',
      'Flat-blade screwdriver', 'Adjustable crescent wrench', 'Combination open-box wrench', 'Pipe wrench with teeth',
      'Slip-joint pliers', 'Needle-nose pliers with serrated jaws', 'Wire cutting pliers', 'Locking vice-grip pliers',
      'Retractable steel tape measure', 'Torpedo bubble spirit level', 'Traditional hand handsaw with wooden grip',
      'Hacksaw with metal tubular frame', 'C-clamp with screw handle', 'Bar clamp with quick release',
      'Cordless electric drill with chuck', 'Drill bit spiral twist', 'Wood chisel with beveled edge',
      'Hand plane for woodworking', 'Block rasp wood file', 'Metal utility knife box cutter', 'Putty knife scraper blade',
      'Soldering iron with stand', 'Hot glue gun with glue stick', 'Caulking gun with sealant tube',
      'Hex Allen key wrench set', 'Socket wrench with ratchet handle', 'Wire stripper plier tool', 'Plumb bob brass weight',
      'Chalk line reel box', 'Folding wooden carpenter ruler', 'Speed square triangular guide',
      'Bench vise with turn screw', 'Steel nail with round head', 'Threaded wood screw', 'Machine bolt with hex nut',
      'Flat metal washer ring', 'Wall anchor plug expansion', 'Safety protective goggles',
      'Leather work glove pair', 'Toolbox with latch and tray', 'Spring clamp with orange tips',
      'Precision tweezers pair', 'Magnet pickup stick tool', 'Wire scratch brush with handle', 'Grease lubricant gun', 'Crowbar with pry claw'
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing and Footwear',
    description: 'Garments, shoes, and wearable apparel',
    subjects: [
      'Casual cotton crewneck t-shirt', 'Button-up collared dress shirt', 'V-neck knit pullover sweater',
      'Hooded fleece sweatshirt jacket', 'Denim jeans with pockets and rivets', 'Khaki pleated dress trousers',
      'Knee-length flared pleated skirt', 'Summer slip dress with straps', 'Tailored suit jacket blazer',
      'Winter wool pea coat with lapel', 'Puffer down jacket with quilted baffled stitching', 'Classic trench coat with storm flap',
      'Leather motorcycle biker jacket', 'Denim trucker jacket with bronze buttons', 'Athletic running shorts',
      'Jogging sweatpants with drawstring', 'Thermal knit beanie winter hat', 'Cotton baseball cap with curved visor',
      'Fedora hat with ribbon band', 'Wide-brim straw sun hat', 'Knit winter woolen scarf with fringes',
      'Silk formal necktie with knot', 'Bowtie with center loop', 'Leather dress belt with rectangular buckle',
      'Patterned crew dress sock', 'Pair of canvas high-top sneakers', 'Leather oxford lace-up dress shoes',
      'Classic penny loafer slip-on shoes', 'Suede chelsea boots with elastic side gusset', 'Rugged work hiking boots with lug soles',
      'Cowboy boots with angled heel', 'Strappy open-toe high heel pumps', 'Ballet flat shoes with front bow',
      'Platform wedge sandals', 'Beach thong flip-flop sandals', 'Slide slip-on sandals', 'Fleece bedroom house slippers',
      'Winter snow boots with fur trim', 'Rain Wellington rubber gumboots', 'Leather winter gloves with stitching',
      'Knit fingerless mittens', 'Overalls with front chest bib', 'Pajama buttoned sleep shirt', 'Bathrobe with waist tie sash',
      'Windbreaker lightweight nylon jacket', 'Track jacket with collar zipper', 'Cargo pants with accordion side pockets',
      'Ankle athletic running socks', 'Winter earmuffs with headband', 'Sun visor headband hat',
      'Silk pocket square with folded peaks', 'Bandana kerchief neckerchief', 'Rain poncho transparent hooded cape',
      'Leather driving gloves with knuckle cutouts', 'Knit leg warmers pair', 'Fleece ear warmer headband'
    ]
  },
  {
    id: 'accessories',
    name: 'Bags and Personal Accessories',
    description: 'Wallets, bags, eyewear, and personal everyday carry items',
    subjects: [
      'Leather bifold pocket wallet', 'Leather trifold card wallet', 'Zippered coin purse pouch',
      'Canvas tote bag with shoulder handles', 'Two-strap canvas backpack', 'Single-strap sling cross-body bag',
      'Leather briefcase with top clasp', 'Laptop messenger shoulder bag with flap', 'Fanny pack waist belt bag',
      'Duffel gym sports bag with barrel shape', 'Hard-shell rolling suitcase with telescopic handle',
      'Weekender travel duffle bag', 'Clutch purse with magnetic snap', 'Drawstring cinch sack bag',
      'Classic aviator sunglasses with wire frame', 'Wayfarer thick-rim sunglasses', 'Round round-rim spectacles',
      'Cat-eye vintage sunglasses', 'Analog wristwatch with leather strap', 'Digital sports watch with resin band',
      'Pocket watch with chain and lid', 'Metallic bead bracelet', 'Leather braided wrist cuff',
      'Chain link necklace with pendant', 'Choker velvet ribbon necklace', 'Solitaire stone finger ring',
      'Signet ring with flat oval seal', 'Hoop earring with hinged clasp', 'Dangle teardrop earring pair',
      'Stud earrings with butterfly back', 'Brooch pin with floral motif', 'Hair scrunchie with gathered fabric',
      'Plastic claw hair clip with teeth', 'Bobby pin metal hair grip', 'Metal barrette hair clasp',
      'Folding pocket hair comb', 'Wooden hair brush with paddle base', 'Metal pill organizer box with compartments',
      'Cardholder case with RFID sleeve', 'Car key fob with button icons', 'Compact umbrella with sleeve cover',
      'Leather passport wallet cover', 'Money clip spring metal clamp', 'Bandana square with paisley pattern',
      'Pocket folding square handkerchief', 'Retractable tape lanyard badge', 'Lip balm twist tube container',
      'Pocket hand sanitizer squeeze bottle', 'Compact mirror foldout duo', 'Carabiner clip with D-ring gate',
      'Leather glasses sleeve case', 'Metal collar stays pair for dress shirt', 'Cufflinks pair with swivel bar',
      'Tie bar metal pinch clip', 'Locket pendant opening oval with hinge', 'Enamel lapel pin with butterfly clutch'
    ]
  },
  {
    id: 'food',
    name: 'Food Items, Fruits, and Vegetables',
    description: 'Produce, baked goods, snacks, and edible subjects',
    subjects: [
      'Crisp red apple with stem and leaf', 'Yellow curved banana with peel end', 'Whole orange with textured rind',
      'Lemon wedge slice with pulp', 'Lime cut in half with seeds', 'Cluster of round purple grapes on vine',
      'Fresh strawberry with green calyx leaf', 'Ripe pear with elongated neck', 'Peach with soft cleft line',
      'Ripe avocado cut in half showing round pit', 'Pineapple with spiky diamond rind', 'Watermelon triangular slice with black seeds',
      'Orange carrot with leafy green stem', 'Purple eggplant with calyx cap', 'Red bell pepper with lobed curves',
      'White bulb of garlic with cloves', 'Yellow onion with paper skin roots', 'Red tomato with five-point star stem',
      'Russet potato with skin eyes', 'Green broccoli floret tree head', 'Leafy stalk of celery with ribbed spine',
      'Corn on the cob with kernel rows', 'Green zucchini squash cylinder', 'Button mushroom with round cap and gill veil',
      'Croissant pastry with flaky layered crescent', 'Loaf of crusty sourdough bread with score slits',
      'French baguette long loaf with diagonal slashes', 'Slice of sandwich bread with square crust',
      'Round glazed doughnut with chocolate frosting', 'Soft pretzel twist with coarse salt crystals',
      'Bagel sliced in half with cream cheese', 'Chocolate chip cookie with melted chocolate morsels',
      'Slice of fruit pie with crimped crust edge', 'Cupcake in ribbed paper wrapper with swirl icing',
      'Slice of pepperoni pizza with melted cheese', 'Stacked burger with sesame seed bun patty and lettuce',
      'Hard boiled egg cut in half with yolk', 'Block of Swiss cheese with circular holes', 'French fries in red paper carton',
      'Sushi nigiri roll with salmon topping', 'California maki sushi roll slice with seaweed ring', 'Steamed dumpling gyoza with pleated folds',
      'Hot dog sausage in long bun with mustard squiggles', 'Taco with folded crispy shell and fillings',
      'Roasted chicken drumstick bone with meat', 'Glass jar of strawberry jam with lid', 'Popsicle frozen ice pop on wooden stick',
      'Chocolate candy bar with breakaway square segments', 'Lollipop spiral swirl disc on stick', 'Pancake stack with melting butter square and syrup drippings'
    ]
  },
  {
    id: 'animals',
    name: 'Animals, Birds, Fish, and Insects',
    description: 'Fauna, domestic pets, wildlife, aquatic creatures, and insects',
    subjects: [
      'Sitting golden retriever dog with wagging tail', 'Domestic cat curled asleep in circle', 'Playful kitten with upright ears',
      'Pug dog head with wrinkled snout', 'Rabbit bunny with upright long ears', 'Hamster holding sunflower seed in paws',
      'Red fox sitting with bushy white-tipped tail', 'Standing gray wolf with alert posture', 'Brown bear walking on all four paws',
      'Deer stag with multi-point branched antlers', 'Spotted fawn deer standing on thin legs', 'African elephant with trunk curled upward',
      'Tall giraffe head and patterned long neck', 'Zebra with distinct bold stripes', 'Horse head with flowing mane and bridle',
      'Roaring lion head with dense radial mane', 'Striped tiger stalking stealthily forward', 'Panda bear seated chewing bamboo stalk',
      'Koala bear hugging eucalyptus branch tree trunk', 'Kangaroo standing tall on hind legs with tail support',
      'Sparrow perched on slender tree twig', 'Pigeon dove standing on ground with rounded chest', 'Wise barn owl with heart-shaped facial disk',
      'Hawk eagle with sharp curved beak and piercing eye', 'Hummingbird hovering mid-air with long needle beak',
      'Flamingo standing on one slender leg', 'Emperor penguin with white belly and folded flipper wings',
      'Pelican with large pouch bill perched on dock post', 'Woodpecker clinging vertically to tree bark',
      'Goldfish swimming with fan fin and ruffled tail', 'Tropical clownfish with vertical white stripes',
      'Sea turtle swimming with outstretched paddle flippers', 'Seahorse upright with curled tail and snout',
      'Bottlenose dolphin leaping curved above water surface', 'Great white shark profile with sharp triangular dorsal fin',
      'Octopus with eight curled suction-cup tentacles', 'Sea jellyfish with bell dome and trailing stinging filaments',
      'Starfish with five textured arms spread flat', 'Red crab with two raised serrated pincers',
      'Spiny lobster with long curved antennae', 'Green tree frog perched on broad lily pad',
      'Garden snail with spiral shell and eye stalks', 'Chameleon with curly spiral tail and swivel eye',
      'Butterfly with symmetrical patterned wings open', 'Honeybee with striped abdomen and translucent wings',
      'Dragonfly with elongated slender body and four clear wings', 'Ladybug beetle with spotted red wing cases',
      'Ant side profile with segmented thorax and antennae', 'Caterpillar with segmented creeping body',
      'Scorpion with curled segmented tail and stinger barb', 'Praying mantis with folded spiny forelegs'
    ]
  },
  {
    id: 'human_figures',
    name: 'Human Figures, Body Parts, Hands, and Facial Expressions',
    description: 'Poses, anatomy studies, gestures, hand studies, and facial features',
    subjects: [
      'Full human figure standing straight in neutral pose', 'Human figure walking forward dynamic side profile',
      'Human figure running with bent knees and swinging arms', 'Human figure seated on stool with elbows on knees',
      'Human figure kneeling on ground with upright torso', 'Human figure jumping mid-air with outstretched limbs',
      'Human figure stretching arms above head', 'Human figure in contemplative thinking thinker pose',
      'Human figure reclining sideways on floor resting on elbow', 'Human torso back view showing shoulder blades',
      'Human hand open palm facing forward with spread fingers', 'Human hand clenched into firm fist front view',
      'Human hand pointing index finger directly forward', 'Human hand holding pencil between thumb and fingers',
      'Human hand making peace victory V-sign gesture', 'Human hand making thumbs-up approval gesture',
      'Human hand resting relaxed sideways curled fingers', 'Two hands shaking in partnership clasp',
      'Pair of hands folded together in prayer meditation', 'Human hand gripping coffee mug handle firmly',
      'Human hand pinching tiny coin between index and thumb', 'Human hand cupped upward as if holding water',
      'Detailed study of human eye open with iris and pupil', 'Human eye looking upward with furrowed brow',
      'Human eye closed in peaceful resting sleep with eyelashes', 'Human ear profile showing cartilage ridges and lobe',
      'Human nose front view showing bridge and nostrils', 'Human nose side profile showing curved nasal bridge',
      'Human lips resting in neutral closed expression', 'Human mouth smiling widely showing upper teeth row',
      'Human mouth open in shout with visible tongue', 'Human skull bone structure front three-quarter view',
      'Human facial portrait neutral frontal gaze', 'Human facial profile side silhouette view',
      'Human face expressing surprise with raised arched eyebrows', 'Human face laughing with squinted joyful eyes',
      'Human face frowning with downturned lip corners', 'Human foot bare side arch profile view',
      'Human foot from above showing toes and metatarsals', 'Human foot standing on tiptoes showing heel tendon',
      'Bent human elbow joint arm flexing bicep muscle', 'Human shoulder joint and collarbone clavicle line',
      'Human knee joint bent at right ninety-degree angle', 'Ballet dancer on pointed toe in arabesque pose',
      'Yoga practitioner in tree balance pose on one leg', 'Person sitting cross-legged in lotus meditation',
      'Person leaning against wall with hands in trouser pockets', 'Child figure sitting playing with building blocks',
      'Older person standing with wooden walking cane', 'Figure carrying heavy shoulder backpack hiking'
    ]
  },
  {
    id: 'sports',
    name: 'Sports Equipment',
    description: 'Balls, bats, rackets, protective gear, and athletic equipment',
    subjects: [
      'Soccer football with hexagonal and pentagonal black-white patch pattern', 'Basketball with textured pebbled surface and curved ribs',
      'American football oval with white lace stitching', 'Tennis ball with fuzzy felt seam line',
      'Baseball with red raised double stitching', 'Golf ball with dimpled round surface',
      'Volleyball with twelve curved panels', 'Bowling ball with three finger grip holes',
      'Wooden bowling pin with neck stripes', 'Wooden baseball bat with taped tapered grip',
      'Tennis racket with woven strings and grip wrap', 'Badminton racket with oval string bed',
      'Badminton feather shuttlecock birdie', 'Table tennis ping-pong paddle with rubber face',
      'Cricket bat with flat wooden blade and cane handle', 'Cricket ball with raised center seam',
      'Ice hockey puck vulcanized rubber disc', 'Ice hockey stick with curved taped blade',
      'Golf driver club with aerodynamic head', 'Bicycle safety helmet with ventilation vents',
      'Boxing glove with padded fist and wrist strap', 'Skipping jump rope with turned wooden handles',
      'Cast iron hexagonal dumbbell weight', 'Kettlebell weight with round base and top horn handle',
      'Barbell bar with round weight plates and collar clamps', 'Yoga mat rolled up with carrying strap',
      'Skateboard with griptape deck and polyurethane wheels', 'Rollerblade inline skate boot with four wheels',
      'Snowboard with metal edges and boot foot bindings', 'Downhill ski pair with curved upturned tips',
      'Ski pole with wrist strap and snow basket ring', 'Swimming goggles with silicone eye cups and nose bridge',
      'Swim flippers fins pair for scuba diving', 'Snorkel breathing tube with soft silicone mouthpiece',
      'Dartboard with concentric numbered rings and bullseye', 'Steel-tip dart with flight fins and knurled barrel',
      'Archery recurve bow with tension bowstring', 'Archery arrow with fletching feathers and pointed arrowhead',
      'Foosball table miniature player figure on rod', 'Gymnastics medicine ball with leather seams',
      'Weightlifting wrist wrap support strap', 'Whistle with lanyard loop and pea rattle',
      'Stopwatch timer with split lap buttons', 'Water bottle sports squeeze nozzle',
      'Athletic agility cone triangular cone marker', 'Lacrosse stick with strung woven pocket net',
      'Horseshoe metal U-shaped throw shoe', 'Billiard pool cue stick with chalked leather tip',
      'Billiard cue eight ball with number eight circle', 'Frisbee flying disc with grooved edge rings'
    ]
  },
  {
    id: 'vehicles',
    name: 'Vehicles and Their Individual Components',
    description: 'Transport, vehicles, wheels, and mechanical vehicular parts',
    subjects: [
      'Classic compact passenger car side profile', 'Vintage Volkswagen beetle car profile',
      'Pickup truck with open cargo bed and tailgate', 'City commuter bicycle with upright frame and basket',
      'Mountain bicycle with knobby tires and suspension fork', 'Motorcycle scooter moped with step-through frame',
      'Classic cruiser motorcycle with teardrop gas fuel tank', 'Four-wheeled kick scooter with T-bar handlebars',
      'Vintage steam locomotive train engine with chimney smoke stack', 'Modern high-speed bullet passenger train nose',
      'Commercial passenger airplane jet side profile', 'Single-engine propeller airplane with front propeller blades',
      'Helicopter cabin with overhead rotor blades and tail boom', 'Wooden rowboat with pair of wooden oars in oarlocks',
      'Sailboat sloop with tall mast and triangular canvas sail', 'Speedboat motorboat with windshield and rear outboard motor',
      'Classic canoe boat with pointed double ends', 'Sea kayak with two-bladed paddle',
      'Vintage tractor with giant rear tread wheels and front small wheels', 'Forklift warehouse vehicle with front lifting prongs',
      'Automobile car steering wheel with horn center and buttons', 'Car dashboard speedometer gauge dial with needle',
      'Car side rear-view mirror assembly with glass reflector', 'Car headlight lamp housing with lens patterns',
      'Automotive wheel rim with five spoke patterns and rubber tire', 'Bicycle wheel with wire spokes and center axle hub',
      'Bicycle handlebar with rubber grips and brake squeeze levers', 'Bicycle saddle seat with springs and clamp post',
      'Bicycle pedal with reflective orange side markers', 'Bicycle chain links looped around toothed gear cog sprocket',
      'Bicycle bell with thumb ringer strike lever', 'Motorcycle exhaust pipe muffler with chrome finish',
      'Automotive car spark plug with ceramic ribbing and metal electrode', 'Automotive disc brake rotor disc with caliper housing',
      'Car battery rectangular box with positive negative terminal posts', 'Automobile engine piston cylinder with wrist pin hole',
      'Automotive car shock absorber coil spring suspension strut', 'Car gas fuel cap with twist handle and tether',
      'Ship nautical steering ship wheel with wooden spokes', 'Nautical boat anchor with flukes and heavy shackle chain ring',
      'Ship navigation propeller bronze blade screw', 'Train wheel with steel flange rim running on track rail',
      'Submarine conning tower with periscope pipe', 'Hot air balloon woven wicker gondola basket with burner',
      'Hot air balloon inflated envelope sphere with stripe panels', 'Zeppelin blimp airship with gondola cabin below',
      'Bicycle tire Schrader air valve stem', 'Car front windshield wiper arm with rubber blade', 'Motorcycle kickstand arm with foot pad',
      'Aircraft airspeed pitot tube probe', 'Ship lifebuoy safety ring with reflective tape', 'Truck external vertical exhaust stack',
      'Car rear trunk lid spoiler wing', 'Car door side handle with thumb press', 'Boat brass cleat horn dock tie',
      'Motorcycle front headlamp chrome bucket'
    ]
  },
  {
    id: 'plants',
    name: 'Plants, Flowers, and Gardening Tools',
    description: 'Botanicals, potted flora, leaves, blossoms, and garden instruments',
    subjects: [
      'Potted succulent plant in terracotta clay saucer pot', 'Cactus plant with rounded ribbed stem and spine clusters',
      'Monstera deliciosa leaf with iconic fenestration cutouts', 'Single rose blossom flower with spiraling layered petals',
      'Sunflower flower head with radiant yellow petals and seed center', 'Daisy blossom with white oval petals and yellow button center',
      'Tulip flower in cup shape on slender smooth stem', 'Orchid blossom with exotic lip petal and arching stalk',
      'Lavender flower sprig with miniature purple blossoms', 'Maple tree leaf with five distinct pointed lobes and veins',
      'Oak tree leaf with rounded wavy lobed margins', 'Fern frond with delicate repetitive pinnate leaflets',
      'Palm tree frond with arching fan fingers', 'Bonsai miniature pine tree in shallow ceramic tray',
      'Four-leaf clover lucky shamrock sprig', 'Dandelion flower head gone to seed puff sphere with parachutes',
      'Bamboo stalk culm with visible nodule rings and leaves', 'Pine cone with overlapping wooden scales',
      'Acorn nut in textured cupule cap on small twig', 'Sprig of fresh mint with serrated veined leaves',
      'Rosemary herb sprig with needle-like aromatic leaves', 'Terracotta round flower plant pot with drainage hole',
      'Metal gardening watering can with long spout and sprinkler rose head', 'Handheld gardening trowel shovel with wooden handle',
      'Gardening hand fork claw with three pointed metal tines', 'Bypass garden pruning shears with curved cutting blades',
      'Long-handled garden hedge shears with straight steel blades', 'Metal garden rake head with row of curved teeth',
      'Garden shovel spade with flat rectangular steel blade', 'Sturdy wooden wheelbarrow with front wheel and leg rests',
      'Coiled green garden water hose with spray nozzle trigger', 'Plant hanging macrame basket with knotted ropes',
      'Watering bulb glass globe spike', 'Plant garden seed packet envelope with illustration',
      'Seedling sprout emerging from dark soil mound with two baby leaves', 'Spade shovel handle with wooden D-grip top',
      'Garden cultivator hoe combination tool head', 'Plant pruning snips for bonsai trimming',
      'Plastic nursery plant seedling pot with drainage slots', 'Heavy duty garden kneeling pad mat cushion',
      'Garden dibber wooden pointed planting tool', 'Plant wooden support climbing trellis ladder',
      'Garden bulb planter cylindrical cutting tool', 'Grass lawn edging manual half-moon shears',
      'Flower arrangement floral frog pin holder', 'Clay seed germination round terracotta dish',
      'Moss pole cylinder for climbing houseplants', 'Garden hose brass spray twist nozzle connector',
      'Garden wire twist tie roll with built-in cutter', 'Botanical plant brass watering mist sprayer pump'
    ]
  },
  {
    id: 'bathroom',
    name: 'Bathroom and Cleaning Items',
    description: 'Personal hygiene supplies, bath accessories, and cleaning equipment',
    subjects: [
      'Manual toothbrush with bristle head and ergonomic grip', 'Electric toothbrush handle with round rotating brush head',
      'Tube of toothpaste with screw cap and squeezed bottom', 'Bar of soap with curved edges on slatted draining soap dish',
      'Pump dispenser bottle for liquid hand soap', 'Shampoo bottle with flip-top dispensing lid',
      'Roll of toilet paper tissue on wall roller spindle', 'Soft cotton bath towel folded neatly in thirds',
      'Woven wicker laundry clothes hamper with lid', 'Hair dryer blowdryer with nozzle concentrator and cord',
      'Safety razor with replaceable double-edge blade head', 'Disposable plastic multi-blade shaving razor with rubber grip',
      'Bristle shaving brush with rounded wooden barber handle', 'Metal can of aerosol shaving foam cream with plastic cap',
      'Rubber toilet plunger with wooden stick handle and suction cup', 'Toilet bowl scrub brush with curved bristles in plastic holder caddy',
      'Handheld shower spray head with multi-spray rubber jets', 'Classic dual cross-handle bathroom sink faucet tap with aerator spout',
      'Rubber yellow bath duck toy floating duckling', 'Plush rectangular memory foam bathroom floor rug mat',
      'Plastic toothbrush rinse tumbler cup', 'Nail clippers with swing-out lever and file',
      'Pumice stone oval scrub rock for foot care', 'Natural bath sea sponge with porous organic holes',
      'Mesh bath pouf loofah scrubber with hanging cord loop', 'Plastic spray bottle with trigger sprayer mist mechanism',
      'Household cleaning rubber gloves pair with textured fingertips', 'Floor mop bucket with squeeze wringer strainer basket',
      'Traditional corn broom with wooden handle and stitched straw bristles', 'Plastic handheld dustpan with rubber front edge lip',
      'Short-handled handheld dustpan sweep whisk brush', 'Cellulose cleaning sponge with abrasive scouring pad backing',
      'Feather duster with fluffy plumes and long plastic handle', 'Window squeegee wiper blade with rubber strip and handle',
      'Scrubbing brush with stiff plastic bristles and iron-style grip handle', 'Bottle of liquid bleach cleaner with childproof ribbed safety cap',
      'Wall suction cup shower caddy basket shelf', 'Plastic shower curtain ring hook with roller balls',
      'Toothpick dispenser container with sliding dispensing top', 'Floss container box with tiny metal cutting blade notch',
      'Bathtub rubber drain stopper plug with metal bead chain', 'Round glass perfume atomizer bottle with squeeze bulb',
      'Hair curling iron wand with clamp lever and cord', 'Hair straightener flat iron clamp with ceramic heating plates',
      'Dental mouth mirror inspection tool with angled mirror', 'Stainless steel tongue scraper curved band with handles',
      'Glass bottle of mouthwash with measuring cap', 'Plastic shower squeegee wiper with hanging hook handle',
      'Cloth laundry wash bag with zipper closure mesh', 'Fabric steamer handheld nozzle head with steam holes'
    ]
  },
  {
    id: 'toys',
    name: 'Toys and Games',
    description: 'Playthings, games, puzzles, and childhood items',
    subjects: [
      'Stuffed plush teddy bear with button eyes and stitched nose', 'Plastic toy building brick block with top round stud pegs',
      'Six-sided cube Rubik puzzle cube with square color tiles', 'Six-sided numbered gaming dice cube with indented pip dots',
      'Twenty-sided polyhedral D20 gaming die with etched numbers', 'Classic yo-yo with wound string loop and split wooden disc halves',
      'Traditional spinning top toy with pointed bottom tip and twist handle', 'Classic wooden rocking horse toy with curved rocker rails',
      'Die-cast miniature toy model car vehicle', 'Toy steam train engine locomotive with small red wheels',
      'Plastic wind-up toy robot with key winding mechanism on side', 'Detailed miniature dollhouse chair furniture piece',
      'Jigsaw puzzle piece with interlocking tabs and blank blanks', 'Wooden stacking toy with colored graduated donut rings on pole',
      'Xylophone musical toy with rainbow colored metal bars and mallet', 'Set of painted wooden alphabet letter building blocks',
      'Handheld water ring toss game with two press buttons', 'Etch-A-Sketch drawing toy box with two circular white turn knobs',
      'Vintage jack-in-the-box metal tin with hand crank and popping clown head', 'Set of five metal jack stones with small rubber bounce ball',
      'Toy kaleidoscope tube with eyepiece lens viewing hole', 'Pinwheel wind spinner with plastic colorful folded vanes on stick',
      'Kite diamond diamond-shaped flying kite with cross spars and tail ribbons', 'Marbles glass sphere with swirled colored glass ribbon inside',
      'Water squirt gun pistol with colorful plastic tank and trigger', 'Bubble blower wand hoop with ring loop handle',
      'Toy boomerang V-shaped throwing wing with painted curved tips', 'Slinky coiled wire helical spring toy walking down stairs',
      'Chess King game piece with cross finial atop crown', 'Chess Queen game piece with coronet points',
      'Chess Knight game piece sculpted as carved horse head', 'Chess Rook castle tower game piece with crenelated battlements',
      'Chess Bishop game piece with carved cleft mitre hat', 'Chess Pawn game piece with round top ball',
      'Set of upright wooden bowling skittles pins with ball', 'Toy plastic soldier army figure on flat base plate holding rifle',
      'Toy action figure robot with articulated ball elbow joints', 'Finger skateboard tech deck with miniature grip tape and trucks',
      'Finger puppet animal cloth sleeve toy', 'Domino tile rectangular block with dividing line and white pip dots',
      'Toy wooden pull-along duck on wheels with pull string', 'Toy stethoscope plastic medical play tool',
      'Miniature wooden abacus with sliding colored counting beads', 'Plastic toy magnifying glass with chunky grip handle',
      'Toy spaceship rocket with landing fin struts and nose cone', 'Toy cash register with push buttons and pop-out money drawer',
      'Plastic nesting Russian matryoshka doll halves', 'Toy plastic tool belt with miniature toy wrench and hammer',
      'Toy plastic pirate telescope spyglass collapsible cylinder', 'Wooden shape sorter cube box with geometric cutouts'
    ]
  },
  {
    id: 'music',
    name: 'Musical Instruments',
    description: 'Acoustic, orchestral, folk, and percussion instruments',
    subjects: [
      'Acoustic wooden guitar with figure-eight body soundhole and six strings', 'Electric guitar with solid sculpted body pickups and volume knobs',
      'Classical wooden violin with carved scroll pegbox bridge and f-shaped soundholes', 'Violin wooden bow with tension frog screw and taut horsehair',
      'Large wooden cello with adjustable metal endpin spike resting on floor', 'Upright double bass with deep wide bouts and arched neck',
      'Trumpet brass horn with three finger piston valves and flared bell', 'Trombone brass horn with telescoping U-shaped hand slide and bell',
      'French horn circular coiled brass tubing with large flared bell and rotary valves', 'Saxophone curved brass body with mother-of-pearl keys and neck ligature',
      'Silver concert flute with tone key pads and lip plate embouchure hole', 'Clarinet wooden pipe with silver keys bell flare and reed mouthpiece',
      'Grand piano with open raised propped lid showing cast iron plate and string harp', 'Upright piano front view showing black and white keyboard keys and foot pedals',
      'Classical accordion with accordion pleated bellows keyboard and bass chord buttons', 'Harmonica mouth organ with row of blow draw holes in chrome cover plates',
      'Snare drum with circular metal tension rim drumhead skin and snare strainer lever', 'Bass drum large cylinder with dual heads and foot kick pedal beater assembly',
      'Drum cymbal round brass plate mounted on tripod cymbal boom stand', 'Pair of wooden drumsticks with tapered wooden oval tips',
      'Tambourine circular wooden hoop frame with jingle metal zils and thumb hole', 'Bongo drums pair of conjoined small wooden open-bottom drums',
      'Acoustic wooden ukulele with four nylon strings and small waist body', 'Acoustic banjo with circular drum skin pot wooden neck and tuning pegs',
      'Grand orchestral harp with triangular pillar neck soundbox and vertical strings', 'Handheld triangle steel bar bent into open triangle with metal strike beater rod',
      'Pair of Mexican wooden maracas with carved shaker heads and turned handles', 'Castanets pair of concave wooden shell clappers tied with thumb cord',
      'Pan flute pipes made of graduated bamboo canes bound in row with cord', 'Glockenspiel metal bar xylophone bells with pair of plastic mallets',
      'Recorder woodwind whistle pipe with seven finger holes and thumb hole', 'Metronome pyramid tower with oscillating inverted pendulum arm and sliding weight counter',
      'Guitar tuning peg machine head gear with turn button', 'Guitar plectrum flat triangular pick with rounded corners',
      'Music stand folding metal wire stand holding open sheet music book', 'Electronic synthesizer keyboard with modulation pitch wheel and slider controls',
      'Guitar foot stompbox distortion effects pedal with foot button switch', 'Drum tuning key T-bar metal socket wrench',
      'Brass singing bowl with wooden rubbing striker stick', 'Steel tongue drum round tank drum with cut pedal notes',
      'Musical tuning fork metal two-pronged fork with stem ball', 'Kalimba African thumb piano with wooden box and metal tines',
      'Ocarina clay sweet potato flute with finger holes and mouthpiece', 'Mandolin teardrop wooden body with dual paired strings and pickguard',
      'Bassoon double reed woodwind instrument with curved metal bocal bocal pipe', 'Didgeridoo wooden pipe cylinder with painted aboriginal dots'
    ]
  },
  {
    id: 'technical',
    name: 'Mechanical and Technical Objects',
    description: 'Hardware mechanisms, gears, engineering components, and laboratory items',
    subjects: [
      'Interlocking spur gear wheel with cut radial teeth and center bore axle', 'Bevel conical gear with angled teeth for 90-degree transmission',
      'Helical worm screw gear with spiral thread meshing with wheel', 'Industrial ball bearing steel ring assembly with caged ball bearings',
      'Compression helical steel coil spring with ground flat ends', 'Tension extension spring with hooked loop ends',
      'Mechanical torsion spring with two extended straight legs', 'Engine crankshaft with offset journals and counterweights',
      'Motor engine piston rod with wrist pin and three compression rings', 'Automotive overhead camshaft with egg-shaped teardrop lobes',
      'Engine exhaust poppet valve with mushroom head and cylindrical stem', 'Heavy duty industrial roller chain with inner and outer pinned links',
      'Toothed timing belt pulley wheel with flange rims', 'Mechanical governor device with dual weighted centrifugal spinning flyballs',
      'Industrial pressure gauge dial with Bourdon tube pointer needle and PSI markings', 'Glass laboratory thermometer with red alcohol bulb column and degree scale',
      'Optical compound microscope with dual eyepiece turret objective lenses and stage clips', 'Precision mechanical micrometer caliper with ratchet thimble and measuring anvil',
      'Stainless steel dial vernier caliper with sliding jaw and depth gauge rod probe', 'Traditional brass balance scale with central beam pivot and two hanging dish pans',
      'Brass weight calibration cylinder with knob top handle', 'Glass laboratory beaker with graduated milliliter markings and pouring spout beak',
      'Glass Erlenmeyer conical flask with flat bottom and cylindrical neck', 'Glass test tube with rounded hemispherical bottom resting in wooden test tube rack',
      'Glass laboratory pipette dropper with rubber squeeze bulb top', 'Bunsen burner with heavy cast base air regulator sleeve and chimney flame tube',
      'Laboratory tripod stand with circular iron ring holding wire gauze mesh', 'Mechanical wind-up music box movement cylinder with comb teeth pins',
      'Pocket magnetic compass with brass casing glass cover and floating magnetic needle', 'Maritime sextant navigation angle instrument with telescope mirror and graduated arc index arm',
      'Telescope brass tube refractor with objective lens hood and tripod mount', 'Binoculars dual optical barrels with central focus turn wheel and rubber eyecups',
      'Vintage typewriter ribbon spool metal wheel with wound inked ribbon cloth', 'Industrial gate valve handwheel with threaded rising stem valve bonnet',
      'Ball valve pipeline lever handle with red rubber sleeve in open position', 'Cast iron pipe elbow 90-degree plumbing fitting with female threaded ends',
      'Plumbing brass hex nipple fitting with male threads on both ends', 'Toggle latch clamp with hook wire loop and lever mechanism',
      'Keyed door cylinder lock mechanism with cut pins and spring channels', 'Automotive spark plug with ceramic insulator ribs threaded body and ground electrode gap',
      'Centrifugal water pump impeller wheel with curved vanes', 'Cast iron pipe tee three-way connector fitting',
      'Pneumatic quick-disconnect air coupler socket fitting', 'Hydraulic cylinder ram piston with chrome shaft rod',
      'Laboratory round Florence flask with spherical body and long neck', 'Glass laboratory funnel with narrow stem tube',
      'Laboratory watch glass circular concave glass dish', 'Crucible porcelain melting cup with triangular lid',
      'Brass plumb bob cone weight with string tie point', 'Vintage mechanical hand tally clicker counter with finger ring'
    ]
  },
  {
    id: 'shapes',
    name: 'Shapes, Simple Forms, and Geometric Objects',
    description: 'Fundamental forms, geometric solids, curves, and still-life primitives',
    subjects: [
      'Solid wooden geometric cube with crisp edges and orthogonal square faces', 'Smooth wooden sphere ball showing single light highlight and cast shadow crescent',
      'Solid geometric cylinder lying horizontally on flat plane showing elliptical ends', 'Solid geometric cylinder standing upright with circular top plane and vertical contour lines',
      'Geometric cone solid standing on circular flat base tapering to sharp apex point', 'Geometric cone solid tipped on side showing conical slope and circular base ellipse',
      'Three-sided triangular pyramid with equilateral triangle base and pointed vertex', 'Four-sided square-base pyramid with four triangular faces meeting at top apex',
      'Rectangular box prism block with three visible perspective faces in three-point perspective', 'Hexagonal prism pillar with six vertical rectangular faces and flat hexagonal top',
      'Octagonal prism column with faceted edges and octagonal base', 'Geometric torus donut ring showing circular cross section and inner hole torus curve',
      'Cut hemisphere bowl half-sphere resting on flat circular face', 'Cut hemisphere resting on curved round bottom like rocking bowl',
      'Dodecahedron geometric solid composed of twelve flat pentagonal faces', 'Icosahedron geometric solid composed of twenty equilateral triangular faces',
      'Octahedron double-pyramid solid with eight equilateral triangular faces', 'Triangular prism block resting horizontally like roof prism wedge',
      'Ellipsoid egg-shaped smooth geometric volume with asymmetrical curves', 'Truncated cone frustum solid with flat circular top and larger flat circular base',
      'Truncated pyramid frustum with flat square top and larger square base', 'Catenary arch curve structure showing natural hanging chain curvature',
      'Parabolic curve solid reflector showing focal parabolic curvature', 'Archimedean spiral spiral curve flat disc with equidistant coils',
      'Cylindrical helical coil helix showing continuous three-dimensional spiral wire path', 'Platonic solid tetrahedron with four identical triangular faces',
      'Beveled cube solid with chamfered angled corner cuts on all twelve edges', 'Hollow open cylinder tube ring with wall thickness perspective',
      'Hollow open box with open top flaps showing inside corner volume depth', 'Stepped pyramid ziggurat form with three stacked square platforms',
      'Curved S-shape compound wavy ribbon showing alternating convex and concave contours', 'Interlocking geometric rings pair linked together in space',
      'Still life drapery cloth fold cascading over sharp edge of wooden box block', 'Creased origami folded paper boat form with triangular center sail',
      'Creased origami paper crane bird form with folded wings and pointed beak head', 'Cardboard cylindrical mailing tube with plastic end cap plug',
      'Oblique cylinder form sheared at 45-degree angle', 'Intersecting orthogonal cubes showing penetrating form geometry',
      'Twisted square prism column showing 90-degree axial helical rotation', 'Möbius strip continuous single-sided geometric ribbon loop',
      'Hollow truncated square pyramid lampshade frame', 'Solid egg ovum with perfect symmetrical curvature highlights',
      'Double-napped conical hourglass form meeting at center vertex point', 'Compound sphere intersecting rectangular plinth block base',
      'Staircase block model showing five uniform riser and tread steps', 'Hyperbolic paraboloid saddle surface geometric sculpture'
    ]
  }
];

// Combine all subjects and deduplicate case-insensitively
function generateMasterLibrary() {
  const seen = new Set();
  const masterSubjects = [];

  for (const cat of BUILT_IN_CATEGORIES) {
    for (const item of cat.subjects) {
      const trimmed = item.trim();
      const lower = trimmed.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        masterSubjects.push(trimmed);
      }
    }
  }

  return masterSubjects;
}

const ALL_MASTER_SUBJECTS = generateMasterLibrary();

// Top-level built-in list entry for "All 1,000+ Objects"
const MASTER_LIBRARY_CATEGORY = {
  id: 'all',
  name: 'Master Drawing Library (All 1,000+ Objects)',
  description: 'Complete randomized practice across all 20 categories (>1,000 distinct objects)',
  subjects: ALL_MASTER_SUBJECTS
};

module.exports = {
  BUILT_IN_CATEGORIES,
  ALL_MASTER_SUBJECTS,
  MASTER_LIBRARY_CATEGORY,
  TOTAL_UNIQUE_OBJECTS_COUNT: ALL_MASTER_SUBJECTS.length
};
