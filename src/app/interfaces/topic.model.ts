export class Topic {
    constructor(
        public volume: string,
        public recordDate: string,
        public sessionTapeRef: string,
        public title: string,
        public notes: string,
        public topicId: number
    ) { }
}
