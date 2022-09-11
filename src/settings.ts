// can be changed to .env
export const basename = '/fs_news/';
export const news_api = 'https://newsapi.org/v2';
export const show_redux: boolean = true;

// can(should) be moved to backend/.env
// export const countries = ['ar','au','at','be','br','bg','ca','cn','co','cu','cz','eg','fr','de','gr','hk','hu','in','id','ie','il','it','jp','lv','lt','my','mx','ma','nl','nz','ng','no','ph','pl','pt','ro','ru','sa','rs','sg','sk','si','za','kr','se','ch','tw','th','tr','ae','ua','gb','us','ve'] as const;  // const for types (else string[])
// export const languages = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','sv','ud','zh'] as const;
// export const languages_enum = ['ar','de','en','es','fr','he','it','nl','no','pt','ru','sv','ud','zh'] as const;
export enum countries_enum {
    ar='ar',
    au='au',
    at='at',
    be='be',
    br='br',
    bg='bg',
    ca='ca',
    cn='cn',
    co='co',
    cu='cu',
    cz='cz',
    eg='eg',
    fr='fr',
    de='de',
    gr='gr',
    hk='hk',
    hu='hu',
    in='in',
    id='id',
    ie='ie',
    il='il',
    it='it',
    jp='jp',
    lv='lv',
    lt='lt',
    my='my',
    mx='mx',
    ma='ma',
    nl='nl',
    nz='nz',
    ng='ng',
    no='no',
    ph='ph',
    pl='pl',
    pt='pt',
    ro='ro',
    ru='ru',
    sa='sa',
    rs='rs',
    sg='sg',
    sk='sk',
    si='si',
    za='za',
    kr='kr',
    se='se',
    ch='ch',
    tw='tw',
    th='th',
    tr='tr',
    ae='ae',
    ua='ua',
    gb='gb',
    us='us',
    ve='ve',
}
export enum languages_enum {
    'ar'='ar',
    'de'='de',
    'en'='en',
    'es'='es',
    'fr'='fr',
    'he'='he',
    'it'='it',
    'nl'='nl',
    'no'='no',
    'pt'='pt',
    'ru'='ru',
    'sv'='sv',
    'ud'='ud',
    'zh'='zh',
}
export enum searchIn_enum {
    title='title',
    description='description',
    content='content'
}
export enum  category_enum {
    business='business',
    entertainment='entertainment',
    general='general',
    health='health',
    science='science',
    sports='sports',
    technology='technology',
}
export enum sorting_enum {
    relevancy='relevancy',
    popularity='popularity',
    publishedAt='publishedAt',
}