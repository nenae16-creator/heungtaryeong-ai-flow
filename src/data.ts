export type Horizon = "지금" | "30분 후" | "60분 후";
export type TravelMode = "아이 동반" | "보행 짧게" | "공연 중심";

type VenueAccessModel = {
  model_status: "available";
  confidence: string;
  selected_model: string;
  venue_aggregate_test_wape: number;
  intersection: string;
  mapping_status: string;
  interpretation_note: string;
  scenario: {
    source_timestamp: string;
    target_timestamp: string;
    current_load_index: number;
    predicted_load_index_60m: number;
    actual_load_index_backtest: number;
  };
};

export type AccessLoadModel = {
  schema_version: string;
  generated_from: string;
  mode: "historical_backtest";
  not_pedestrian_count: boolean;
  not_live_2026_data: boolean;
  forecast_horizon_minutes: number;
  thirty_minute_policy: string;
  dual_venue_warning: string;
  venues: {
    stadium: VenueAccessModel;
    samgeori: VenueAccessModel;
  };
};

export type ConfirmedProgram2026 = {
  id: string;
  name: string;
  start_date: string | null;
  start_time: string | null;
  venue_name: string;
  time_precision: string;
  status: string;
};

export type Programs2026 = {
  as_of: string;
  detail_schedule_status: "partial";
  warning: string;
  confirmed_exact_time_count: number;
  programs: ConfirmedProgram2026[];
};

export type FestivalScheduleEvent = {
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  event_name: string;
  data_year: number;
  reference_only: "Y";
};

export type FestivalBooth = {
  zone: string;
  booth_category: "experience" | "local_food" | "operations_and_public" | "food_truck";
  booth_number: string;
  booth_name: string;
  operator: string;
};

export type FestivalMapPoint = {
  x_pct: number;
  y_pct: number;
  coordinate_quality: string;
};

export type FestivalZone = FestivalMapPoint & {
  zone_id: string;
  zone_name: string;
};

export type FestivalBoothMarker = FestivalMapPoint & FestivalBooth & {
  booth_id: string;
};

export type OnsiteFacility = FestivalMapPoint & {
  facility_id: string;
  facility_type: "parking" | "toilet" | "lactation";
  label: string;
};

export type NearbyParking = {
  name: string;
  distance_km_straight: number;
  capacity_total: number;
  accessible_spaces: number;
  latitude: number;
  longitude: number;
  distance_quality: "straight_line";
};

export type NearbyToilet = {
  name: string;
  distance_km_straight: number;
  opening_hours: string;
  road_address: string;
  accessible: boolean;
  diaper_changing_table: string;
  latitude: number;
  longitude: number;
  geocode_confidence: string;
  distance_quality: "straight_line";
};

export type FestivalGuide = {
  data_year: number;
  reference_only: true;
  "2026_status": string;
  summary: {
    schedule_events: number;
    booths: number;
    zones: number;
    shuttle_variants: number;
    traffic_controls: number;
    languages: number;
  };
  schedule: FestivalScheduleEvent[];
  booths: FestivalBooth[];
  booth_counts: Record<string, number>;
  zones: FestivalZone[];
  map: {
    source_image: string;
    source_width: number;
    source_height: number;
    coordinate_system: string;
    north_up: false;
    zones: FestivalZone[];
    booth_markers: FestivalBoothMarker[];
    onsite_facilities: OnsiteFacility[];
    nearby_parking: NearbyParking[];
    nearby_toilets: NearbyToilet[];
    limitations: string[];
  };
  shuttles: Array<{
    route_id: string;
    variant: string;
    stops: number;
    trip_minutes: number;
    distance_km: number;
    peak_interval_minutes: number;
    offpeak_interval_minutes: number;
  }>;
  traffic_controls: Array<{
    event_date: string;
    segment: string;
    start_time: string;
    end_time: string;
    control_type: string;
    road: string;
  }>;
  languages: Array<{ language: string; notice_url: string }>;
};

export type CommerceCandidate = {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  admin_dong: string;
  address: string;
  walkMinutesEstimate: number;
  note: string;
};

export const commerceCandidates: CommerceCandidate[] = [
  { id: "천안-2011-005", name: "선비숲불갈비", category: "한식", neighborhood: "신부동", admin_dong: "신안동", address: "천안시 동남구 터미널3길 21", walkMinutesEstimate: 8, note: "종합운동장 인근 동남 상권" },
  { id: "천안-2012-036", name: "신부동가정식백반", category: "한식", neighborhood: "신부동", admin_dong: "신안동", address: "천안시 동남구 터미널3길 23", walkMinutesEstimate: 8, note: "공공 등록 착한가격업소" },
];

export const loadByHorizon: Record<Horizon, { stadium: number; samgeori: number; corridor: number }> = {
  "지금": { stadium: 76, samgeori: 42, corridor: 61 },
  "30분 후": { stadium: 83, samgeori: 48, corridor: 69 },
  "60분 후": { stadium: 64, samgeori: 55, corridor: 58 },
};

export const routes: Record<TravelMode, Array<{ time: string; title: string; note: string; tone: "green" | "orange" | "yellow" }>> = {
  "아이 동반": [
    { time: "16:20", title: "가족체험존", note: "실내·휴식 좌석 인접 · 35분", tone: "green" },
    { time: "17:05", title: "동남구 상권 잠시 들르기", note: "착한가격업소 후보 · 도보 6분", tone: "yellow" },
    { time: "18:10", title: "메인 공연 복귀", note: "접근 부하 완화 예상 시각", tone: "orange" },
  ],
  "보행 짧게": [
    { time: "16:20", title: "가까운 휴식 거점", note: "현재 위치 기준 4분", tone: "green" },
    { time: "16:50", title: "근거리 식음 구역", note: "보행거리 우선 · 25분", tone: "yellow" },
    { time: "17:30", title: "보조 공연장", note: "총 예상 보행 760m", tone: "orange" },
  ],
  "공연 중심": [
    { time: "16:20", title: "국제춤대회", note: "보조무대 · 40분", tone: "green" },
    { time: "17:10", title: "이동·휴식", note: "피크 구간 우회", tone: "yellow" },
    { time: "18:00", title: "메인 공연", note: "혼잡 완화 구간에 입장", tone: "orange" },
  ],
};

export const sourceMeta = [
  { name: "간결 지도 배경", owner: "OpenStreetMap·OpenFreeMap", status: "벡터 지도", updated: "Positron 무라벨 스타일" },
  { name: "스마트교차로 교통량", owner: "천안시", status: "실제 수집·백테스트", updated: "2025.09 원천" },
  { name: "공영주차장 현황", owner: "천안시", status: "공공데이터", updated: "55개소·4,906면" },
  { name: "공연·행사 시간축", owner: "천안문화재단", status: "부분 확정", updated: "7개 프로그램·정확 시각 1개" },
  { name: "2025 공식 축제 운영자료", owner: "천안문화재단", status: "전년도 참고·권리확인", updated: "102개 일정·81개 부스·5개 언어" },
  { name: "실시간·공식 예보", owner: "Open-Meteo·기상청", status: "실시간 API", updated: "2시간 강수 감지 · KMA 스냅샷 수집기" },
  { name: "착한가격업소", owner: "천안시", status: "공공데이터 등록", updated: "2026-03-26 기준 124개소" },
];
