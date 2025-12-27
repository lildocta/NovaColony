export interface PlanetData {
    id: number;
    distance: number;
    size: number;
    color: string;
    speed: number;
    angle: number; // Initial angle
    name: string;
    type: string;
}

export interface StarData {
    id: number;
    position: [number, number, number];
    name: string;
    size: number;
    color: string;
    type: string;
    planets: PlanetData[];
}

export type Selection =
    | { type: 'star'; data: StarData }
    | { type: 'planet'; data: PlanetData; starName: string };
