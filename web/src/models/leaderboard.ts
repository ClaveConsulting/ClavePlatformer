import {
    getRecordTimeAPI,
    getRecordTimeLocalStorage,
    getSelectedLevel,
    getTournamentValue,
    GREEN,
    IGameRecord,
    IRecordTimeApiResponse,
    LEADERBOARD_HIGHLIGHT_STYLE,
    LEADERBOARD_STYLE,
    PALE_GREEN_NUMBER,
    WHITE_NUMBER,
} from "../utils";
import {IPlayerInfo} from "./playerInfo";

export class Leaderboard {
    public frame: Phaser.GameObjects.Rectangle;
    private parent: Phaser.Scene;
    private X: number;
    private Y: number;
    private title: Phaser.GameObjects.Text;
    private names: Phaser.GameObjects.Text[];
    private times: Phaser.GameObjects.Text[];
    private ranks: Phaser.GameObjects.Text[];
    private currentPlayer?: IPlayerInfo;
    private writtenCurrentPlayer: boolean;
    private content: IPlayerInfo[];

    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        currentPlayer?: IPlayerInfo
    ) {
        this.parent = parent;
        this.X = posX;
        this.Y = posY;
        this.frame = this.parent.add
            .rectangle(this.X, this.Y, 600, 800, PALE_GREEN_NUMBER)
            .setScrollFactor(0);

        this.frame.setStrokeStyle(10, WHITE_NUMBER);
        this.title = this.parent.add
            .text(0, 0, "Leaderboard", {
                color: GREEN,
                fontSize: "50px",
                fontStyle: "bold",
                fontFamily: "Press2p",
            })
            .setScrollFactor(0);
        this.title.setPosition(
            posX - this.title.width / 2,
            this.frame.y - this.frame.height / 2 + 20
        );
        this.names = [];
        this.times = [];
        this.ranks = [];
        this.currentPlayer = currentPlayer;
        this.writtenCurrentPlayer = false;

        this.refresh();
    }

    public async init() {
        const selectedLevel = getSelectedLevel();
        const isLocalTournament = getTournamentValue();
        if (!!selectedLevel) {
            if (isLocalTournament) {
                this.content = getRecordTimeLocalStorage(selectedLevel);
            } else {
                this.content = await getRecordTimeAPI(selectedLevel);
            }
        }
    }

    public async refresh() {
        await this.init();
        this.clear();
        this.update();
    }

    public destroy() {
        this.clear();
        this.frame.destroy();
        this.title.destroy();
    }

    private update() {
        const selectedLevel = getSelectedLevel();
        const currentPlayer = this.currentPlayer;
        let currentPlayerRank = 0;
        if (!!selectedLevel) {
            if (!!currentPlayer) {
                currentPlayerRank =
                    this.content.findIndex((x) => x.id === currentPlayer.id) + 1;
            }
            if (this.content.length > 10) {
                this.content = this.content.slice(0, 10);
            }

            let yPos = this.frame.getTopCenter().y + 100;
            let index = 0;
            this.content.forEach(
                (gameRecord: IGameRecord | IRecordTimeApiResponse) => {
                    if (gameRecord.map == selectedLevel) {
                        this.ranks.push(
                            this.parent.add
                                .text(
                                    this.frame.getBottomLeft().x + 30,
                                    yPos,
                                    String(`${index + 1}.`),
                                    LEADERBOARD_STYLE
                                )
                                .setScrollFactor(0)
                        );
                        if (this.currentPlayer?.id == gameRecord.id && this.currentPlayer) {
                            this.names.push(
                                this.parent.add
                                    .text(
                                        this.frame.getBottomLeft().x + 90,
                                        yPos,
                                        gameRecord.name ?? "--" + ": ",
                                        LEADERBOARD_HIGHLIGHT_STYLE
                                    )
                                    .setScrollFactor(0)
                            );
                            this.times.push(
                                this.parent.add
                                    .text(
                                        this.frame.getBottomRight().x - 135,
                                        yPos,
                                        gameRecord.time,
                                        LEADERBOARD_HIGHLIGHT_STYLE
                                    )
                                    .setScrollFactor(0)
                            );
                            this.writtenCurrentPlayer = true;
                        } else {
                            this.names.push(
                                this.parent.add
                                    .text(
                                        this.frame.getBottomLeft().x + 90,
                                        yPos,
                                        gameRecord.name ?? "--" + ": ",
                                        LEADERBOARD_STYLE
                                    )
                                    .setScrollFactor(0)
                            );
                            this.times.push(
                                this.parent.add
                                    .text(
                                        this.frame.getBottomRight().x - 135,
                                        yPos,
                                        gameRecord.time,
                                        LEADERBOARD_STYLE
                                    )
                                    .setScrollFactor(0)
                            );
                        }
                        yPos += 45;
                        index++;
                    }
                }
            );

            if (
                typeof this.currentPlayer !== "undefined" &&
                this.writtenCurrentPlayer == false
            ) {
                this.parent.add.text(
                    this.frame.getBottomLeft().x + 30,
                    yPos - 15,
                    " ... ",
                    LEADERBOARD_STYLE
                );

                this.ranks.push(
                    this.parent.add
                        .text(
                            this.frame.getBottomLeft().x + 30,
                            yPos + 25,
                            String(`${currentPlayerRank}.`),
                            LEADERBOARD_STYLE
                        )
                        .setScrollFactor(0)
                );
                this.names.push(
                    this.parent.add
                        .text(
                            this.frame.getBottomLeft().x + 90,
                            yPos + 25,
                            this.currentPlayer.name ?? "--" + ": ",
                            LEADERBOARD_HIGHLIGHT_STYLE
                        )
                        .setScrollFactor(0)
                );
                this.times.push(
                    this.parent.add
                        .text(
                            this.frame.getBottomRight().x - 135,
                            yPos + 25,
                            String(this.currentPlayer.time),
                            LEADERBOARD_HIGHLIGHT_STYLE
                        )
                        .setScrollFactor(0)
                );
            }
        }
    }

    private clear() {
        this.names.forEach((name) => {
            name.destroy();
        });
        this.times.forEach((time) => {
            time.destroy();
        });
        this.ranks.forEach((rank) => {
            rank.destroy();
        });
    }
}
