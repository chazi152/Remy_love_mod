# Pregnancy Doc

Pregnancy is split into different sections of JavaScript

-   storyFunctions.js - Functions that are used in scenes, related to player or npc pregnancies
-   childrenStoryFunctions.js - Functions that are used in scenes, related to either player's or npc's children
-   pregnancyTypes.js - Generates a pregnancy object to be used to start a new pregnancy
-   pregnancy.js - Functions that start, progress and end existing non-parasite pregnancies
-   parasite.js - Functions that start, progress and end existing parasite pregnancies

## Important References

Please take these into consideration before changing any of the code.

-   When referring to player character in the code, the string `"pc"` should be used in a similar way that `"Robin"` could be used for named NPCs. These are case sensitive.

## storyFunctions.js Usage

### Player Functions

#### getPregnancyObject(mother, returnGenital)

Will return the pregnancy object of the mother for either the pc for named npc's.

-   `<<set _playerPregnancyObject to getPregnancyObject()>>`
-   `<<set [_pregnancyObject, _genital] to getPregnancyObject("pc", true)>>`
-   `<<set _robinPregnancyObject to getPregnancyObject("Robin")>>`

#### playerIsPregnant()

Will return `true` if the player is pregnant with a non-parasite.

-   `<<if playerIsPregnant()>>`

#### playerAwareTheyCanBePregnant()

Will return `true` if the player knows they can become pregnant. Used specifically for male pregnancy.

-   `<<if playerAwareTheyCanBePregnant()>>`

#### playerAwareTheyArePregnant()

Will return `true` if the player knows they are pregnant.

-   `<<if playerAwareTheyArePregnant()>>`

#### playerPregnancyProgress(percent)

Will return between 0.00 and 1.00 based on how far the players pregnancy is. Providing false, will return the raw value, tho not expected to be used this way normally.

-   `<<if playerPregnancyProgress() gte 0.5>>`
-   `<<if between(playerPregnancyProgress(), 0.1, 0.4)>>`

#### playerNormalPregnancyTotal()

Will return the number of times the pc has gotten pregnant.

-   `<<set _pregnancyCount to playerNormalPregnancyTotal()>>`
-   `<<if playerNormalPregnancyTotal() gte 5>>`

#### playerBellySize(pregnancyOnly)

Will return the players belly size, ranges from 0 to 24. Include true to make it pregnancy specific.

-   `<<set _bellySize to playerBellySize()>>`
-   `<<set _bellySizeFromPregnancy to playerBellySize(true)>>`
-   `<<if playerBellySize(true)>>`

#### playerBellyVisible(pregnancyOnly)

Will return `true` if the player's belly is visible. Include true to make it pregnancy specific.

-   `<<if playerBellyVisible()>>`
-   `<<if playerBellyVisible(true)>>`

#### isPlayerNonparasitePregnancyEnding()

Will return `true` if the players non-parasite pregnancy is ending.

-   `<<if isPlayerNonparasitePregnancyEnding()>>`

#### playerNormalPregnancyType()

Will return the players pregnancy type as long as its not `parasite`.

-   `<<set _type to playerNormalPregnancyType()>>`
-   `<<if playerNormalPregnancyType() is "human">>`
-   `<<if playerNormalPregnancyType() isnot "wolf">>`

#### wakingPregnancyEvent()

Will return a random event type relating to menstruation/pregnancy, look to the `<<widget "wakingEffects">>` for usage.

#### dailyPregnancyEvent()

Will return a random event type relating to menstruation/pregnancy, look to the `<<widget "pregnancyDailyEvent">>` for usage.

#### playerPregnancyRisk()

Will return the player current risk of pregnancy ranging from 0 to 6. 0 Being high chance of pregnancy, 6 being extremely low chance or zero chance depending on pregnancy type.

-   `<<if playerPregnancyRisk() lte 1>>`

#### playerHeatMinArousal()

Will return the minimum arousal increase from being in heat. Will only be above 0 if the player is able to get pregnant, at high risk of pregnancy, and current is not. Once the player is pregnant, if in heat, the values will say as if they are not pregnant, but at any point it stops, it will not start up again till the player is no longer pregnant. Fertility pills can cause a mild form to occur at any point outside of pregnancy. Minimum arousal is capped to `4000` for all sources.

-   `<<if playerHeatMinArousal() gte 1000>>`

#### playerAwareTheyAreInHeat()

A combination usage of `playerHeatMinArousal() && playerAwareTheyCanBePregnant()` as male's may not yet be aware they can be pregnant.

-   `<<if playerAwareTheyAreInHeat()>>`

#### playerRutMinArousal()

Will return the minimum arousal increase from being in rut. Will only be above 0 if the player has a penis. The chance of rut occurring is random, but more likely the longer since the last time it occurred. Fertility pills can increase the frequency of rut occurring. Minimum arousal is capped to `4000` for all sources.

-   `<<if playerHeatMinArousal() gte 1000>>`

### Named NPC Functions

#### npcIsPregnant(npc)

Will return `true` if the named npc is pregnant.

-   `<<if npcIsPregnant("Robin")>>`
-   `<<set _isPregnant to npcIsPregnant("Avery")>>`

#### npcPregnancyEnding(npc)

Will return `true` if the named npc pregnancy is ending.

-   `<<if npcPregnancyEnding("Robin")>>`

#### npcBellySize(npc)

Will return the named npc's belly size, ranges from 0 to 24.

-   `<<set _bellySize to npcBellySize("Robin")>>`
-   `<<set _bellySizeFromPregnancy to npcBellySize("Avery")>>`
-   `<<if npcBellySize("Sydney") gte 15>>`

#### npcBellyVisible(npc)

Will return `true` if the named npc's belly is visible.

-   `<<if npcBellyVisible("Robin")>>`
-   `<<if npcBellyVisible("Avery")>>`

### Pregnancy KnowsAbout Functions

These are a series of functions which are there to track who knows about what pregnancy. Those beginning with set, will set who knows about the pregnancy, while the other are used to confirm who knows, etc.

#### knowsAboutPregnancy(mother, whoToCheck, existingId)

Used to check if the `whoToCheck` knows about the current or an existing pregnancy of the `mother`.

-   `<<if knowsAboutPregnancy("pc","Whitney")>>` - Check if whitney is already aware of the players's current pregnancy
-   `<<if knowsAboutPregnancy("pc", "Whitney", 0)>>` - Check if whitney is aware of the players's first pregnancy
-   `<<if knowsAboutPregnancy("Whitney","pc")>>` - Check if the player is already aware of Whitney's current pregnancy
-   `<<if knowsAboutPregnancy("Whitney", "pc", 0)>>` - Check if the player is aware of Whitney's first pregnancy

#### setKnowsAboutPregnancy(mother, whoNowKnows, existingId, track, pregnancyOverride)

Used to set `whoNowKnows` as someone who knows about the `mother`'s current or past pregnancy. Be sure to double check the usage when your providing an ID rather than "pc" or named npc's name. `track` is used to record the pregnancy for `V.babyIntro`, see current usage in `function giveBirthToChildren(mother, birthLocation, location, pregnancyOverride)`. `pregnancyOverride` is for random npc's specifically and normally should not be used outside of current usage.

-   `<<setKnowsAboutPregnancy "pc" "Whitney">>` - When whitney is aware of the players's current pregnancy
-   `<<setKnowsAboutPregnancy "pc" "Whitney" 0>>` - When whitney is aware of the players's first pregnancy
-   `<<setKnowsAboutPregnancy "Whitney" "pc">>` - When the player is aware of Whitney's current pregnancy
-   `<<setKnowsAboutPregnancy "Whitney" "pc" 0>>` - When the player is aware of Whitney's first pregnancy

#### setKnowsAboutPregnancyCurrentLoaded()

Used for current named npc's loaded into `V.NPCList`, and lets them learn about the players's current pregnancy if its visible. Used in widgets where the players state of dress changes.

-   `<<setKnowsAboutPregnancyCurrentLoaded>>`

#### setKnowsAboutPregnancyInLocation(motherOrFather, whoNowKnows, location, track)

Makes the `whoNowKnows` be aware of every pregnancy for the `motherOrFather`. `location` is used to limit it to a specific location.

-   `<<setKnowsAboutPregnancyInLocation "Kylar" "pc">>`
-   `<<setKnowsAboutPregnancyInLocation "Kylar" "pc" "home">>`

#### knowsAboutPregnancyTotal(motherOrFather, whoToCheck, location)

Will return the number of pregnancies the `whoToCheck` knows about for `motherOrFather`. `location` is optional for checking for children in a specific location.

-   `<<set _knownPregnancyCount to knowsAboutPregnancyTotal("pc", "Bailey")>>`
-   `<<set _knownPregnancyCountInOrphanage to knowsAboutPregnancyTotal("pc", "Bailey", "home")>>`

#### knowsAboutAnyPregnancy(mother, whoToCheck)

Will return `true` if the `whoToCheck` knows about any pregnancy for the `mother`.

-   `<<if knowsAboutAnyPregnancy("pc", "Kylar")>>`

#### knowsAboutChildrenTotal(motherOrFather, whoToCheck, location)

Will return the number of children the `whoToCheck` knows about for `motherOrFather`. `location` is optional for checking for children in a specific location.

-   `<<set _knownPregnancyCount to knowsAboutChildrenTotal("pc", "Bailey")>>`
-   `<<set _knownPregnancyCountInOrphanage to knowsAboutChildrenTotal("pc", "Bailey", "home")>>`

### Other Functions

#### pregnancyNameCorrection(name, caps)

Will attempt to correct names being display, might not be 100% applicable to all uses.

-   `You know that the father is <<print pregnancyNameCorrection($_pregnancy.potentialFathers[0].source)>>.`
-   `<<set _fatherName to pregnancyNameCorrection(_pregnancyTest.potentialFathers[0].source)>><span class="lewd">It's clear that <<print _fatherName is "yourself" ? "you are" : _fatherName + " is">> the father.</span>`

#### pregnancyDaysEta(pregnancyObject)

Will return the number of days left before the player/npc will give birth, needs a pregnancy object specifically.

-   `<<if pregnancyDaysEta(getPregnancyObject()) lt 5>>`
-   `<<set _pregnancyObject to getPregnancyObject()>><<print pregnancyDaysEta(_pregnancyObject)>> days remaining.`

#### childrenCountBetweenParents(parent1, parent2)

Returns the number of children between two parents, expects to be provided strings of their name.

-   `<<set _childCount to childrenCountBetweenParents("pc", "Robin")`
-   `<<if childrenCountBetweenParents("pc", "Robin") gt 1>>`

#### pregnancyCountBetweenParents(parent1, parent2)

Returns the number of pregnancies between two parents, expects to be provided strings of their name.

-   `<<set _childCount to pregnancyCountBetweenParents("pc", "Robin")`
-   `<<if pregnancyCountBetweenParents("pc", "Robin") gt 0>>`

#### setBabyIntro(mother, introFor, birthId)

Set the `V.babyIntro` variable so that specific introductions with the named npc can be handled later. Look to the passages `Pregnancy Birth Prison` for usage.

-   `<<setBabyIntro "pc" "Bailey">>`

#### removeBabyIntro(mother, introFor, birthId)

Removes specific birth id's from the `V.babyIntro`, used when the introduction of the baby to the named npc is handled on its own unique event. Look to the passages `Pregnancy Birth Asylum` for usage.

-   `<<removeBabyIntro "pc" "Bailey" $recentBirthId>>`

## childrenStoryFunctions.js Usage

### setChildFirstWord(childId, word, playerAbsent = false)

Will set and return the first word that the child says.

### Children Activity

These are used when the `Childrens Home` passage is currently active, and a sub-function should exist for each type of baby the PC can have.

#### updateChildActivity(childId)

Manages the variables for children activities, then calls the specific function required for each baby type.

#### humanChildActivity(childId)

Sets the variable `child.localVariables.activity` to a new event when called. This allows the player to interact with their human children.

#### wolfChildActivity(childId)

Sets the variable `child.localVariables.activity` to a new event when called. This allows the player to interact with their wolf children.

## pregnancyTypes.js Usage

### Supporting Functions

#### maxParasites(genital = "anus")

Returns the number of parasites that can be in the vagina or anus.

#### canImpregnateParasite(genital = "anus")

Returns if the player can be impregnated by parasites in the vagina or anus.

#### canBeMPregnant()

Returns if the player can be impregnated in the anus. Only males are supported currently.

#### npcPregObject(person, mother)

Prepares an object with all the variables in place. See the function for examples.

#### pregPrep({ motherObject, fatherObject, parasiteType = null, genital = null })

Prepares specific variables that are required for the different pregnancy generators. Will return a string if the pregnancy is invalid and the reason for it. See the function for examples.

#### bodySizeCalc(bodysize)

Returns a string of the body size that a baby will have, the size returned will be adjusted with rng. Currently only checked against the pc's stat.

#### sizeName(bodysize)

Similar to the `bodySizeCalc(bodysize)` function, but does not have any rng with it. Currently only checked against the pc's stat.

#### eyeColourCalc(colour)

Currently ensures that a valid eye colour is provided.

#### hairColourCalc(colour)

Currently ensures that a valid hair colour is provided.

#### skinColourCalc(colour)

Currently ensures that a valid skin colour is provided.

#### beastTransform(mother, father)

Will set the beast transformation variable of that will be set for human babies. Currently only checks for the pc's current completed beast transformation.

#### divineTransform(mother, father)

Will set the divine transformation variable of that will be set for human babies. Currently only checks for the pc's current completed divine transformation.

#### babyBase = ({mother = null, motherKnown = true, father = null, fatherKnown = false, birthId = null, childId = null,type = null, gender = "f", identical = null, size = null, hairColour = null, eyeColour = null, monster = null, skinColour = null, clothes = null, beastTransform = null, divineTransform = null})

Returns a baby object in the expected format, using the many inputs.

### Pregnancy Generator
