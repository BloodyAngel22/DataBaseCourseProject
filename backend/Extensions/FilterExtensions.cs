using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Filters;
using backend.Models;

namespace backend.Extensions
{
    public static class FilterExtensions
    {
		public static IQueryable<Student> Filter(this IQueryable<Student> query, StudentFilter filter)
		{
			if (!string.IsNullOrEmpty(filter.GroupName))
			{
				query = query.Where(s => s.GroupName == filter.GroupName);
			}

			if (!string.IsNullOrEmpty(filter.Course))
			{
				query = query.Where(s => s.Course == short.Parse(filter.Course));
			}

			if (!string.IsNullOrEmpty(filter.DateStart) && !string.IsNullOrEmpty(filter.DateEnd))
			{
				var dateStart = DateOnly.Parse(filter.DateStart);
				var dateEnd = DateOnly.Parse(filter.DateEnd);

				query = query.Where(s => dateStart <= s.Birthdate && dateEnd >= s.Birthdate);
			}

			return query;
		}

		public static IQueryable<ExamDiscipline> Filter(this IQueryable<ExamDiscipline> query, ExamDisciplineFilter filter)
		{
			if (!string.IsNullOrEmpty(filter.ExamType))
			{
				query = query.Where(s => s.EventFormType == filter.ExamType);
			}

			if (!string.IsNullOrEmpty(filter.DateStart) && !string.IsNullOrEmpty(filter.DateEnd))
			{
				var dateStart = DateTime.Parse(filter.DateStart);
				var dateEnd = DateTime.Parse(filter.DateEnd);

				query = query.Where(s => dateStart <= s.EventDatetime && dateEnd >= s.EventDatetime);
			}

			return query;
		}

		public static IQueryable<Statement> Filter(this IQueryable<Statement> query, StatementFilter filter)
		{
			if (!string.IsNullOrEmpty(filter.EventDateTimeStart) && !string.IsNullOrEmpty(filter.EventDateTimeEnd))
			{
				var dateStart = DateTime.Parse(filter.EventDateTimeStart);
				var dateEnd = DateTime.Parse(filter.EventDateTimeEnd);

				query = query.Where(s => dateStart <= s.ExamDiscipline.EventDatetime&& dateEnd >= s.ExamDiscipline.EventDatetime);
			}

			if (!string.IsNullOrEmpty(filter.SessionYear))
			{
				var sessionYear = short.Parse(filter.SessionYear);

				query = query.Where(s => s.SessionYear == sessionYear);
			}

			if (!string.IsNullOrEmpty(filter.DateIssuedStart) && !string.IsNullOrEmpty(filter.DateIssuedEnd))
			{
				var dateStart = DateOnly.Parse(filter.DateIssuedStart);
				var dateEnd = DateOnly.Parse(filter.DateIssuedEnd);

				query = query.Where(s => dateStart <= s.DateIssued && dateEnd >= s.DateIssued);
			}

			return query;
		}
    }
}