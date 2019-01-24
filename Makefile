build: clean
	npx tsc --project ./packages/bee
	@echo "build successfully 👨‍❤️‍👨"

clean:
	rm -rf ./packages/bee/lib
	@echo "clean successfully 💖 \n"