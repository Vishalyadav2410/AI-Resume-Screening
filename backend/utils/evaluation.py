def mean_reciprocal_rank(ranked_lists, relevant_index):
    mrr = 0
    for rank_list in ranked_lists:
        for i, val in enumerate(rank_list):
            if val == relevant_index:
                mrr += 1 / (i + 1)
                break
    return mrr / len(ranked_lists)