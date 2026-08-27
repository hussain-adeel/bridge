import { TEAM_IDS } from "../../../shared/gameConstants.js";
import { supabase } from "../utils/supabase.js";

export async function createMatchRecord(players) {
    const { data: match, error: matchError } = await supabase
        .from("matches")
        .insert({status: "in_progress"})
        .select("id")
        .single();
    
    if (matchError) throw matchError;

    const { error: playerError } = await supabase
        .from("match_players")
        .insert(
            players.map((player) => ({
                match_id: match.id,
                user_id: player.id,
                team_id: player.teamId,
            }))
    );

    if (playerError) throw playerError;

    return match.id;
}

export async function recordRoundStats({
    players,
    roundWinnerTeamId,
    playerTricks,
    completedTricks,
}) {

    const results = await Promise.all(
        players.map((player) => 
            supabase.rpc("increment_profile_stats", {
                target_user_id: player.id,
                played_rounds: 1,
                won_rounds: player.teamId === roundWinnerTeamId ? 1 : 0,
                played_tricks: completedTricks,
                won_tricks: playerTricks[player.index] ?? 0,
                played_matches: 0,
                won_matches: 0,
            })
        )
    )

    for (const { error } of results) {
        if (error) throw error;
    }
}

export async function completeMatchRecord({
    players,
    matchWinnerTeamId,
    matchScore,
    matchId
}) {
    const { error: matchError } = await supabase
        .from("matches")
        .update({
            status: "completed",
            winning_team: matchWinnerTeamId,
            team_1_score: matchScore[TEAM_IDS.ONE],
            team_2_score: matchScore[TEAM_IDS.TWO]
        })
        .eq("id", matchId);
    
    if (matchError) throw matchError;

    const results = await Promise.all(
        players.map((player) => 
            supabase.rpc("increment_profile_stats", {
                target_user_id: player.id,
                played_matches: 1,
                won_matches: player.teamId === matchWinnerTeamId ? 1 : 0,
            })
        )
    )

    for (const { error } of results) {
        if (error) throw error;
    }
}
