```markdownlayout: default
title: Horizon News - होम
paginate: 5
permalink: /sp/<header>
  <h1>Horizon News</h1>
  <p>नवीनतम न्यूज़ और अपडेट्स यहाँ।</p>
</header>

<main>
  <h2>नवीनतम पोस्ट्स</h2>
  {% for post in paginator.posts %}
    <article>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p><small>{{ post.date | date: "%d %B %Y" }}</small></p>
      <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
      <a href="{{ post.url | relative_url }}">पूरा पढ़ें →</a>
    </article>
  {% endfor %}

  {% if paginator.total_pages > 1 %}
<nav class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | relative_url }}">पिछला</a>
  {% endif %}
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | relative_url }}">अगला</a>
  {% endif %}
</nav>
  {% endif %}</main>

<footer>
  <p>&copy; 2025 Horizon News. Powered by Jekyll.</p>
</footer>
```

