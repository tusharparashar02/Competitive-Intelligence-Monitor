import { useQuery } from '@tanstack/react-query';
import jobService        from '../services/jobService';
import pageChangeService from '../services/pageChangeService';
import redditService     from '../services/redditService';
import changelogService  from '../services/changelogService';

export function useJobs(competitorId, page = 1) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['jobs', competitorId, page],
    queryFn:  () => jobService.getJobs(competitorId, page),
    enabled:  !!competitorId,
  });

  return { data: data?.data ?? null, isLoading, isError, error };
}

export function usePageChanges(competitorId, page = 1) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pageChanges', competitorId, page],
    queryFn:  () => pageChangeService.getChanges(competitorId, page),
    enabled:  !!competitorId,
  });

  return { data: data?.data ?? null, isLoading, isError, error };
}

export function useRedditMentions(competitorId, page = 1) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reddit', competitorId, page],
    queryFn:  () => redditService.getMentions(competitorId, page),
    enabled:  !!competitorId,
  });

  return { data: data?.data ?? null, isLoading, isError, error };
}

export function useSentimentTrend(competitorId, lastDays = 30) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sentiment', competitorId, lastDays],
    queryFn:  () => redditService.getSentiment(competitorId, lastDays),
    enabled:  !!competitorId,
  });

  return { sentiment: data?.data ?? null, isLoading, isError, error };
}

export function useChangelog(competitorId, page = 1) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['changelog', competitorId, page],
    queryFn:  () => changelogService.getEntries(competitorId, page),
    enabled:  !!competitorId,
  });

  return { data: data?.data ?? null, isLoading, isError, error };
}
